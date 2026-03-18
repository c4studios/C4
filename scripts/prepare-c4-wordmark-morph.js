import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  C4_WORDMARK_ITALIC_GROUP_OFFSET,
  C4_WORDMARK_LETTERS,
  RAW_C4_WORDMARK_MORPH_PAIRS,
} from '../src/components/c4/c4WordmarkMorphSource.js';

const COMMAND_PARAM_COUNTS = {
  A: 7,
  C: 6,
  H: 1,
  L: 2,
  M: 2,
  Q: 4,
  S: 4,
  T: 2,
  V: 1,
  Z: 0,
};

const TOKEN_REGEX = /[AaCcHhLlMmQqSsTtVvZz]|[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?/g;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPORT_PATH = path.resolve(__dirname, '../reports/c4-wordmark-morph-readiness.json');
const VALIDATION_ARTIFACT_PATH = path.resolve(__dirname, '../reports/c4-wordmark-morph-validation.svg');
const NORMALIZED_DATA_PATH = path.resolve(__dirname, '../src/components/c4/c4WordmarkMorphNormalized.js');

function tokenizePathData(pathData) {
  return pathData.match(TOKEN_REGEX) || [];
}

function isCommandToken(token) {
  return /^[AaCcHhLlMmQqSsTtVvZz]$/.test(token);
}

function createCommand(type, values) {
  return {
    type,
    absoluteType: type.toUpperCase(),
    values: values.map(Number),
  };
}

function parsePathData(pathData) {
  const tokens = tokenizePathData(pathData);
  const commands = [];
  let index = 0;
  let activeType = null;

  while (index < tokens.length) {
    const token = tokens[index];

    if (isCommandToken(token)) {
      activeType = token;
      index += 1;

      if (token.toUpperCase() === 'Z') {
        commands.push(createCommand(token, []));
        activeType = null;
      }

      continue;
    }

    if (!activeType) {
      throw new Error(`Invalid path data near token "${token}"`);
    }

    const arity = COMMAND_PARAM_COUNTS[activeType.toUpperCase()];

    if (index + arity > tokens.length) {
      throw new Error(`Insufficient parameters for command "${activeType}"`);
    }

    commands.push(createCommand(activeType, tokens.slice(index, index + arity)));
    index += arity;

    if (activeType.toUpperCase() === 'M') {
      activeType = activeType === 'M' ? 'L' : 'l';
    }
  }

  return commands;
}

function absolutizeCommands(commands) {
  const absolute = [];
  let currentX = 0;
  let currentY = 0;
  let startX = 0;
  let startY = 0;

  commands.forEach((command) => {
    const isRelative = command.type !== command.absoluteType;
    const type = command.absoluteType;
    const values = command.values.slice();

    switch (type) {
      case 'M': {
        const x = isRelative ? currentX + values[0] : values[0];
        const y = isRelative ? currentY + values[1] : values[1];
        absolute.push({ type: 'M', values: [x, y] });
        currentX = x;
        currentY = y;
        startX = x;
        startY = y;
        break;
      }
      case 'L': {
        const x = isRelative ? currentX + values[0] : values[0];
        const y = isRelative ? currentY + values[1] : values[1];
        absolute.push({ type: 'L', values: [x, y] });
        currentX = x;
        currentY = y;
        break;
      }
      case 'H': {
        const x = isRelative ? currentX + values[0] : values[0];
        absolute.push({ type: 'L', values: [x, currentY] });
        currentX = x;
        break;
      }
      case 'V': {
        const y = isRelative ? currentY + values[0] : values[0];
        absolute.push({ type: 'L', values: [currentX, y] });
        currentY = y;
        break;
      }
      case 'C': {
        const normalized = [
          isRelative ? currentX + values[0] : values[0],
          isRelative ? currentY + values[1] : values[1],
          isRelative ? currentX + values[2] : values[2],
          isRelative ? currentY + values[3] : values[3],
          isRelative ? currentX + values[4] : values[4],
          isRelative ? currentY + values[5] : values[5],
        ];
        absolute.push({ type: 'C', values: normalized });
        currentX = normalized[4];
        currentY = normalized[5];
        break;
      }
      case 'S': {
        const normalized = [
          isRelative ? currentX + values[0] : values[0],
          isRelative ? currentY + values[1] : values[1],
          isRelative ? currentX + values[2] : values[2],
          isRelative ? currentY + values[3] : values[3],
        ];
        absolute.push({ type: 'S', values: normalized });
        currentX = normalized[2];
        currentY = normalized[3];
        break;
      }
      case 'Q': {
        const normalized = [
          isRelative ? currentX + values[0] : values[0],
          isRelative ? currentY + values[1] : values[1],
          isRelative ? currentX + values[2] : values[2],
          isRelative ? currentY + values[3] : values[3],
        ];
        absolute.push({ type: 'Q', values: normalized });
        currentX = normalized[2];
        currentY = normalized[3];
        break;
      }
      case 'T': {
        const normalized = [
          isRelative ? currentX + values[0] : values[0],
          isRelative ? currentY + values[1] : values[1],
        ];
        absolute.push({ type: 'T', values: normalized });
        currentX = normalized[0];
        currentY = normalized[1];
        break;
      }
      case 'Z': {
        absolute.push({ type: 'Z', values: [] });
        currentX = startX;
        currentY = startY;
        break;
      }
      default:
        throw new Error(`Unsupported command "${command.type}" in morph prep`);
    }
  });

  return absolute;
}

function lerp(a, b, t) {
  return {
    x: a.x + ((b.x - a.x) * t),
    y: a.y + ((b.y - a.y) * t),
  };
}

function cubicLineSegment(start, end) {
  return {
    p0: start,
    p1: lerp(start, end, 1 / 3),
    p2: lerp(start, end, 2 / 3),
    p3: end,
  };
}

function quadraticToCubic(start, control, end) {
  return {
    p0: start,
    p1: {
      x: start.x + ((2 / 3) * (control.x - start.x)),
      y: start.y + ((2 / 3) * (control.y - start.y)),
    },
    p2: {
      x: end.x + ((2 / 3) * (control.x - end.x)),
      y: end.y + ((2 / 3) * (control.y - end.y)),
    },
    p3: end,
  };
}

function reflectPoint(point, origin) {
  return {
    x: (2 * origin.x) - point.x,
    y: (2 * origin.y) - point.y,
  };
}

function pointsEqual(a, b, tolerance = 0.000001) {
  return Math.abs(a.x - b.x) <= tolerance && Math.abs(a.y - b.y) <= tolerance;
}

function commandsToCubicContours(pathData) {
  const commands = absolutizeCommands(parsePathData(pathData));
  const contours = [];
  let currentContour = null;
  let currentPoint = { x: 0, y: 0 };
  let contourStart = { x: 0, y: 0 };
  let previousCommandType = null;
  let previousCubicControl = null;
  let previousQuadraticControl = null;

  commands.forEach((command) => {
    switch (command.type) {
      case 'M': {
        if (currentContour && currentContour.segments.length > 0) {
          contours.push(currentContour);
        }

        const point = { x: command.values[0], y: command.values[1] };
        currentContour = { segments: [], closed: false };
        currentPoint = point;
        contourStart = point;
        previousCubicControl = null;
        previousQuadraticControl = null;
        previousCommandType = 'M';
        break;
      }
      case 'L': {
        const end = { x: command.values[0], y: command.values[1] };
        currentContour.segments.push(cubicLineSegment(currentPoint, end));
        currentPoint = end;
        previousCubicControl = null;
        previousQuadraticControl = null;
        previousCommandType = 'L';
        break;
      }
      case 'C': {
        const segment = {
          p0: currentPoint,
          p1: { x: command.values[0], y: command.values[1] },
          p2: { x: command.values[2], y: command.values[3] },
          p3: { x: command.values[4], y: command.values[5] },
        };
        currentContour.segments.push(segment);
        currentPoint = segment.p3;
        previousCubicControl = segment.p2;
        previousQuadraticControl = null;
        previousCommandType = 'C';
        break;
      }
      case 'S': {
        const reflectedControl = (previousCommandType === 'C' || previousCommandType === 'S')
          ? reflectPoint(previousCubicControl, currentPoint)
          : currentPoint;
        const segment = {
          p0: currentPoint,
          p1: reflectedControl,
          p2: { x: command.values[0], y: command.values[1] },
          p3: { x: command.values[2], y: command.values[3] },
        };
        currentContour.segments.push(segment);
        currentPoint = segment.p3;
        previousCubicControl = segment.p2;
        previousQuadraticControl = null;
        previousCommandType = 'S';
        break;
      }
      case 'Q': {
        const control = { x: command.values[0], y: command.values[1] };
        const end = { x: command.values[2], y: command.values[3] };
        const segment = quadraticToCubic(currentPoint, control, end);
        currentContour.segments.push(segment);
        currentPoint = end;
        previousQuadraticControl = control;
        previousCubicControl = null;
        previousCommandType = 'Q';
        break;
      }
      case 'T': {
        const reflectedControl = (previousCommandType === 'Q' || previousCommandType === 'T')
          ? reflectPoint(previousQuadraticControl, currentPoint)
          : currentPoint;
        const end = { x: command.values[0], y: command.values[1] };
        const segment = quadraticToCubic(currentPoint, reflectedControl, end);
        currentContour.segments.push(segment);
        currentPoint = end;
        previousQuadraticControl = reflectedControl;
        previousCubicControl = null;
        previousCommandType = 'T';
        break;
      }
      case 'Z': {
        if (!pointsEqual(currentPoint, contourStart)) {
          currentContour.segments.push(cubicLineSegment(currentPoint, contourStart));
        }
        currentContour.closed = true;
        contours.push(currentContour);
        currentContour = null;
        currentPoint = contourStart;
        previousCubicControl = null;
        previousQuadraticControl = null;
        previousCommandType = 'Z';
        break;
      }
      default:
        throw new Error(`Unsupported absolute command "${command.type}"`);
    }
  });

  if (currentContour && currentContour.segments.length > 0) {
    contours.push(currentContour);
  }

  return contours;
}

function translatePoint(point, offset) {
  return {
    x: point.x + offset.x,
    y: point.y + offset.y,
  };
}

function translateContour(contour, offset) {
  return {
    ...contour,
    segments: contour.segments.map((segment) => ({
      p0: translatePoint(segment.p0, offset),
      p1: translatePoint(segment.p1, offset),
      p2: translatePoint(segment.p2, offset),
      p3: translatePoint(segment.p3, offset),
    })),
  };
}

function evaluateCubic(segment, t) {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const t2 = t * t;
  const a = mt2 * mt;
  const b = 3 * mt2 * t;
  const c = 3 * mt * t2;
  const d = t * t2;

  return {
    x: (a * segment.p0.x) + (b * segment.p1.x) + (c * segment.p2.x) + (d * segment.p3.x),
    y: (a * segment.p0.y) + (b * segment.p1.y) + (c * segment.p2.y) + (d * segment.p3.y),
  };
}

function contourDensePoints(contour, samplesPerSegment = 24) {
  const points = [];

  contour.segments.forEach((segment, segmentIndex) => {
    for (let step = 0; step < samplesPerSegment; step += 1) {
      if (segmentIndex > 0 && step === 0) continue;
      points.push(evaluateCubic(segment, step / samplesPerSegment));
    }
  });

  return points;
}

function signedArea(points) {
  let area = 0;

  for (let index = 0; index < points.length; index += 1) {
    const current = points[index];
    const next = points[(index + 1) % points.length];
    area += (current.x * next.y) - (next.x * current.y);
  }

  return area / 2;
}

function reverseContour(contour) {
  return {
    ...contour,
    segments: contour.segments.slice().reverse().map((segment) => ({
      p0: segment.p3,
      p1: segment.p2,
      p2: segment.p1,
      p3: segment.p0,
    })),
  };
}

function contourAnchorPoints(contour) {
  return contour.segments.map((segment) => segment.p0);
}

function centroid(points) {
  const totals = points.reduce((accumulator, point) => ({
    x: accumulator.x + point.x,
    y: accumulator.y + point.y,
  }), { x: 0, y: 0 });

  return {
    x: totals.x / points.length,
    y: totals.y / points.length,
  };
}

function rotateArray(values, shift) {
  if (shift === 0) return values.slice();
  return values.slice(shift).concat(values.slice(0, shift));
}

function rotateContourSegments(contour, shift) {
  return {
    ...contour,
    segments: rotateArray(contour.segments, shift),
  };
}

function alignContourStartPoint(uprightContour, italicContour) {
  const uprightPoints = contourAnchorPoints(uprightContour);
  const italicPoints = contourAnchorPoints(italicContour);
  const uprightCenter = centroid(uprightPoints);
  const italicCenter = centroid(italicPoints);
  let bestShift = 0;
  let bestScore = Number.POSITIVE_INFINITY;

  for (let shift = 0; shift < italicPoints.length; shift += 1) {
    const rotated = rotateArray(italicPoints, shift);
    let score = 0;

    for (let index = 0; index < uprightPoints.length; index += 1) {
      const uprightPoint = uprightPoints[index];
      const italicPoint = rotated[index];
      const dx = (uprightPoint.x - uprightCenter.x) - (italicPoint.x - italicCenter.x);
      const dy = (uprightPoint.y - uprightCenter.y) - (italicPoint.y - italicCenter.y);
      score += (dx * dx) + (dy * dy);
    }

    if (score < bestScore) {
      bestScore = score;
      bestShift = shift;
    }
  }

  return {
    shift: bestShift,
    contour: rotateContourSegments(italicContour, bestShift),
  };
}

function splitCubicAt(segment, t) {
  const p01 = lerp(segment.p0, segment.p1, t);
  const p12 = lerp(segment.p1, segment.p2, t);
  const p23 = lerp(segment.p2, segment.p3, t);
  const p012 = lerp(p01, p12, t);
  const p123 = lerp(p12, p23, t);
  const p0123 = lerp(p012, p123, t);

  return [
    {
      p0: segment.p0,
      p1: p01,
      p2: p012,
      p3: p0123,
    },
    {
      p0: p0123,
      p1: p123,
      p2: p23,
      p3: segment.p3,
    },
  ];
}

function segmentLength(segment) {
  let total = 0;
  let previous = segment.p0;

  for (let step = 1; step <= 12; step += 1) {
    const point = evaluateCubic(segment, step / 12);
    total += Math.hypot(point.x - previous.x, point.y - previous.y);
    previous = point;
  }

  return total;
}

function expandContourToSegmentCount(contour, targetSegmentCount) {
  if (contour.segments.length > targetSegmentCount) {
    throw new Error(`Cannot reduce exact contour segment count from ${contour.segments.length} to ${targetSegmentCount}`);
  }

  let segments = contour.segments.slice();

  while (segments.length < targetSegmentCount) {
    let longestIndex = 0;
    let longestLength = -1;

    segments.forEach((segment, index) => {
      const length = segmentLength(segment);
      if (length > longestLength) {
        longestLength = length;
        longestIndex = index;
      }
    });

    const [left, right] = splitCubicAt(segments[longestIndex], 0.5);
    segments.splice(longestIndex, 1, left, right);
  }

  return {
    ...contour,
    segments,
  };
}

function formatNumber(value) {
  const normalized = Number(value.toFixed(4));
  return Number.isInteger(normalized) ? String(normalized) : normalized.toString();
}

function contourToPathData(contour) {
  if (!contour.segments.length) return '';

  const first = contour.segments[0].p0;
  const commands = [`M${formatNumber(first.x)} ${formatNumber(first.y)}`];

  contour.segments.forEach((segment) => {
    commands.push(
      `C${formatNumber(segment.p1.x)} ${formatNumber(segment.p1.y)} ${formatNumber(segment.p2.x)} ${formatNumber(segment.p2.y)} ${formatNumber(segment.p3.x)} ${formatNumber(segment.p3.y)}`
    );
  });

  if (contour.closed) {
    commands.push('Z');
  }

  return commands.join(' ');
}

function contourBounds(contour) {
  const points = contourDensePoints(contour);

  return points.reduce((bounds, point) => ({
    minX: Math.min(bounds.minX, point.x),
    minY: Math.min(bounds.minY, point.y),
    maxX: Math.max(bounds.maxX, point.x),
    maxY: Math.max(bounds.maxY, point.y),
  }), {
    minX: Number.POSITIVE_INFINITY,
    minY: Number.POSITIVE_INFINITY,
    maxX: Number.NEGATIVE_INFINITY,
    maxY: Number.NEGATIVE_INFINITY,
  });
}

function inspectRawPath(pathData) {
  if (!pathData) {
    return {
      exists: false,
      contourCount: 0,
      segmentCount: 0,
      isMultiContour: false,
      signatures: [],
    };
  }

  const contours = commandsToCubicContours(pathData);

  return {
    exists: true,
    contourCount: contours.length,
    segmentCount: contours.reduce((count, contour) => count + contour.segments.length, 0),
    isMultiContour: contours.length > 1,
    signatures: contours.map((contour) => contour.segments.length),
  };
}

function buildContourPairings(uprightContours, italicContours) {
  if (uprightContours.length !== italicContours.length) {
    return {
      contourCountsMatch: false,
      pairings: [],
    };
  }

  const rankedUpright = uprightContours
    .map((contour, index) => ({
      index,
      area: Math.abs(signedArea(contourDensePoints(contour))),
    }))
    .sort((left, right) => right.area - left.area);

  const rankedItalic = italicContours
    .map((contour, index) => ({
      index,
      area: Math.abs(signedArea(contourDensePoints(contour))),
    }))
    .sort((left, right) => right.area - left.area);

  return {
    contourCountsMatch: true,
    pairings: rankedUpright.map((uprightContour, rank) => ({
      role: rank === 0 ? 'outer' : `inner-${rank}`,
      uprightContourIndex: uprightContour.index,
      italicContourIndex: rankedItalic[rank].index,
      uprightArea: Number(uprightContour.area.toFixed(3)),
      italicArea: Number(rankedItalic[rank].area.toFixed(3)),
    })),
  };
}

function normalizePair(pair) {
  const uprightContours = commandsToCubicContours(pair.uprightPath);
  const italicContours = commandsToCubicContours(pair.italicPath).map((contour) => translateContour(
    contour,
    C4_WORDMARK_ITALIC_GROUP_OFFSET,
  ));

  const pairingPlan = buildContourPairings(uprightContours, italicContours);

  if (!pairingPlan.contourCountsMatch) {
    return {
      status: 'blocked-structure-mismatch',
      normalizedPaths: null,
      normalization: null,
      blockingReason: 'upright and italic contour counts differ',
      nextPrepPlan: pairingPlan,
    };
  }

  const normalizedContourPairs = pairingPlan.pairings.map((pairing) => {
    const rawUprightContour = uprightContours[pairing.uprightContourIndex];
    let rawItalicContour = italicContours[pairing.italicContourIndex];
    const uprightArea = signedArea(contourDensePoints(rawUprightContour));
    const italicArea = signedArea(contourDensePoints(rawItalicContour));
    let reversedItalicWinding = false;

    if ((uprightArea < 0 && italicArea > 0) || (uprightArea > 0 && italicArea < 0)) {
      rawItalicContour = reverseContour(rawItalicContour);
      reversedItalicWinding = true;
    }

    const targetSegmentCount = Math.max(
      rawUprightContour.segments.length,
      rawItalicContour.segments.length,
    );

    const uprightContour = expandContourToSegmentCount(rawUprightContour, targetSegmentCount);
    const italicContour = expandContourToSegmentCount(rawItalicContour, targetSegmentCount);
    const alignedItalic = alignContourStartPoint(uprightContour, italicContour);

    return {
      role: pairing.role,
      uprightContourIndex: pairing.uprightContourIndex,
      italicContourIndex: pairing.italicContourIndex,
      targetSegmentCount,
      reversedItalicWinding,
      italicStartPointShift: alignedItalic.shift,
      uprightContour,
      italicContour: alignedItalic.contour,
      maxDeviation: 0,
      meanDeviation: 0,
    };
  });

  const normalizedPaths = {
    uprightPath: normalizedContourPairs.map((item) => contourToPathData(item.uprightContour)).join(' '),
    italicPath: normalizedContourPairs.map((item) => contourToPathData(item.italicContour)).join(' '),
  };

  return {
    status: 'runtime-ready',
    normalizedPaths,
    normalization: {
      contourMode: normalizedContourPairs.length === 1 ? 'single-contour' : 'multi-contour',
      segmentRepresentation: 'absolute-cubic-exact-subdivision',
      originalSegmentCounts: {
        upright: uprightContours.map((contour) => contour.segments.length),
        italic: italicContours.map((contour) => contour.segments.length),
      },
      legacyDenseSegmentCount: uprightContours.reduce((count, contour) => count + contour.segments.length, 0),
      optimizedSegmentCount: normalizedContourPairs.reduce((count, contour) => count + contour.targetSegmentCount, 0),
      preferredRuntimeCandidate: true,
      italicSourceOffsetApplied: C4_WORDMARK_ITALIC_GROUP_OFFSET,
      contourPairs: normalizedContourPairs.map((item) => ({
        role: item.role,
        uprightContourIndex: item.uprightContourIndex,
        italicContourIndex: item.italicContourIndex,
        targetSegmentCount: item.targetSegmentCount,
        reversedItalicWinding: item.reversedItalicWinding,
        italicStartPointShift: item.italicStartPointShift,
        maxDeviation: item.maxDeviation,
        meanDeviation: item.meanDeviation,
      })),
      errorMetrics: {
        pair: {
          maxDeviation: 0,
          meanDeviation: 0,
        },
      },
    },
    blockingReason: null,
    nextPrepPlan: pairingPlan,
  };
}

function buildGeneratedData() {
  return Object.fromEntries(
    RAW_C4_WORDMARK_MORPH_PAIRS.map((pair) => [pair.morphPrep.normalizedPairId, normalizePair(pair)]),
  );
}

function inspectPair(pair, generatedEntry) {
  const upright = inspectRawPath(pair.uprightPath);
  const italic = inspectRawPath(pair.italicPath);

  return {
    index: pair.index,
    letter: pair.letter,
    pairId: pair.morphPrep.normalizedPairId,
    status: generatedEntry.status,
    upright,
    italic,
    normalization: generatedEntry.normalization,
    blockingReason: generatedEntry.blockingReason,
    nextPrepPlan: generatedEntry.nextPrepPlan || null,
    signOffRisk: generatedEntry.status === 'runtime-ready' ? 'none' : 'blocked',
  };
}

function createReadinessReport(generatedData) {
  const pairs = RAW_C4_WORDMARK_MORPH_PAIRS.map((pair) => inspectPair(
    pair,
    generatedData[pair.morphPrep.normalizedPairId],
  ));

  return {
    generatedAt: new Date().toISOString(),
    word: C4_WORDMARK_LETTERS.join(''),
    pairCount: pairs.length,
    validationArtifact: VALIDATION_ARTIFACT_PATH,
    summary: {
      runtimeReady: pairs.filter((pair) => pair.status === 'runtime-ready').length,
      blocked: pairs.filter((pair) => pair.status.startsWith('blocked')).length,
      signOffRisk: pairs.filter((pair) => pair.signOffRisk !== 'none').length,
    },
    pairs,
  };
}

function writeReport(report) {
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
}

function writeNormalizedData(generatedData) {
  const moduleSource = `export const C4_WORDMARK_NORMALIZED_PAIRS = ${JSON.stringify(generatedData, null, 2)};\n`;
  fs.writeFileSync(NORMALIZED_DATA_PATH, moduleSource, 'utf8');
}

function buildCellTransform(bounds, columnIndex, rowIndex) {
  const cellWidth = 220;
  const cellHeight = 140;
  const marginX = 24;
  const marginY = 34;
  const availableWidth = 150;
  const availableHeight = 74;
  const shapeWidth = Math.max(1, bounds.maxX - bounds.minX);
  const shapeHeight = Math.max(1, bounds.maxY - bounds.minY);
  const scale = Math.min(availableWidth / shapeWidth, availableHeight / shapeHeight);
  const offsetX = marginX + (columnIndex * cellWidth) + 18 + ((availableWidth - (shapeWidth * scale)) / 2) - (bounds.minX * scale);
  const offsetY = marginY + (rowIndex * cellHeight) + 18 + ((availableHeight - (shapeHeight * scale)) / 2) - (bounds.minY * scale);

  return `translate(${formatNumber(offsetX)} ${formatNumber(offsetY)}) scale(${formatNumber(scale)})`;
}

function buildValidationArtifact(generatedData) {
  const width = 920;
  const rowHeight = 140;
  const height = 40 + (RAW_C4_WORDMARK_MORPH_PAIRS.length * rowHeight);
  const columns = [
    { key: 'uprightRaw', label: 'Upright Source' },
    { key: 'italicRaw', label: 'Italic Source' },
    { key: 'uprightNormalized', label: 'Runtime Upright' },
    { key: 'italicNormalized', label: 'Runtime Italic' },
  ];

  const header = columns.map((column, index) => (
    `<text x="${24 + (index * 220)}" y="20" font-size="12" font-family="monospace" fill="#111">${column.label}</text>`
  )).join('\n');

  const rows = RAW_C4_WORDMARK_MORPH_PAIRS.map((pair, rowIndex) => {
    const normalized = generatedData[pair.morphPrep.normalizedPairId];
    const rawUprightContours = commandsToCubicContours(pair.uprightPath);
    const rawItalicContours = commandsToCubicContours(pair.italicPath).map((contour) => translateContour(
      contour,
      C4_WORDMARK_ITALIC_GROUP_OFFSET,
    ));
    const normalizedUprightContours = normalized.normalizedPaths
      ? commandsToCubicContours(normalized.normalizedPaths.uprightPath)
      : [];
    const normalizedItalicContours = normalized.normalizedPaths
      ? commandsToCubicContours(normalized.normalizedPaths.italicPath)
      : [];

    const rowLabel = `<text x="24" y="${54 + (rowIndex * rowHeight)}" font-size="12" font-family="monospace" fill="#111">${pair.index} ${pair.letter} | ${normalized.status} | risk:${normalized.status === 'runtime-ready' ? 'none' : 'blocked'}</text>`;
    const cells = [
      rawUprightContours,
      rawItalicContours,
      normalizedUprightContours,
      normalizedItalicContours,
    ].map((contours, columnIndex) => {
      if (!contours.length) return '';

      const bounds = contours.reduce((accumulator, contour) => {
        const contourBox = contourBounds(contour);
        return {
          minX: Math.min(accumulator.minX, contourBox.minX),
          minY: Math.min(accumulator.minY, contourBox.minY),
          maxX: Math.max(accumulator.maxX, contourBox.maxX),
          maxY: Math.max(accumulator.maxY, contourBox.maxY),
        };
      }, {
        minX: Number.POSITIVE_INFINITY,
        minY: Number.POSITIVE_INFINITY,
        maxX: Number.NEGATIVE_INFINITY,
        maxY: Number.NEGATIVE_INFINITY,
      });

      const transform = buildCellTransform(bounds, columnIndex, rowIndex);
      const pathMarkup = contours.map((contour) => (
        `<path d="${contourToPathData(contour)}" fill="#1a1a1b"/>`
      )).join('');

      return `<g transform="${transform}">${pathMarkup}</g>`;
    }).join('\n');

    return `${rowLabel}\n${cells}`;
  }).join('\n');

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#f5f3ef"/>
  ${header}
  ${rows}
</svg>
`;

  fs.writeFileSync(VALIDATION_ARTIFACT_PATH, svg, 'utf8');
}

function formatError(value) {
  return value == null ? 'n/a' : value.toFixed(4);
}

function formatSegmentCounts(values) {
  return Array.isArray(values) ? values.join('+') : String(values);
}

function formatPairLine(pair) {
  return [
    `[${pair.index}] ${pair.letter}`,
    `status:${pair.status}`,
    `orig=${formatSegmentCounts(pair.normalization.originalSegmentCounts.upright)}/${formatSegmentCounts(pair.normalization.originalSegmentCounts.italic)}`,
    `runtime=${pair.normalization.optimizedSegmentCount}`,
    `preferred=${pair.normalization.preferredRuntimeCandidate ? 'yes' : 'no'}`,
    `maxErr=${formatError(pair.normalization.errorMetrics.pair.maxDeviation)}`,
    `meanErr=${formatError(pair.normalization.errorMetrics.pair.meanDeviation)}`,
    `risk=${pair.signOffRisk}`,
  ].join(' | ');
}

function printReport(report) {
  console.log('C4 wordmark morph readiness report');
  console.log(`Word: ${report.word}`);
  console.log(`Pairs inspected: ${report.pairCount}`);
  console.log('');

  report.pairs.forEach((pair) => {
    console.log(formatPairLine(pair));
  });

  console.log('');
  console.log(`Summary: runtimeReady=${report.summary.runtimeReady}, blocked=${report.summary.blocked}, signOffRisk=${report.summary.signOffRisk}`);
  console.log(`Report written: ${REPORT_PATH}`);
  console.log(`Normalized data written: ${NORMALIZED_DATA_PATH}`);
  console.log(`Validation artifact written: ${VALIDATION_ARTIFACT_PATH}`);
}

function main() {
  const generatedData = buildGeneratedData();
  const report = createReadinessReport(generatedData);
  fs.mkdirSync(path.dirname(VALIDATION_ARTIFACT_PATH), { recursive: true });
  writeNormalizedData(generatedData);
  writeReport(report);
  buildValidationArtifact(generatedData);
  printReport(report);
}

main();
