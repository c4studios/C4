/**
 * Article — the APRA perimeter, and why a non-bank licensee is often sold the
 * wrong compliance product.
 *
 * Assembled 1 September 2026 from a research pack, then re-verified. Every
 * quote below was fetched again at the source for this file.
 *
 * THIS IS THE HIGHEST LEGAL-BOUNDARY RISK ARTICLE IN THE LIBRARY. Caleb is
 * partway through a law degree and that is the only credential he claims. The
 * article reports what APRA, ASIC and the standards themselves say. It does not
 * tell any reader which regulator covers them, what their obligations are, or
 * whether they comply. Every edit must hold that line.
 *
 * SOURCE 1 — APRA, "Who we are", apra.gov.au/who-we-are. Verified verbatim
 * 1 Sep 2026:
 *   · "APRA oversees banks, credit unions, building societies, general
 *     insurance and reinsurance companies, life insurers, private health
 *     insurers, friendly societies, and a large part of the superannuation
 *     industry."
 *   · "Each of these financial institutions is an APRA-regulated entity."
 *   · "APRA's role is to protect the Australian community by establishing and
 *     enforcing legally binding standards that apply to APRA-regulated
 *     entities."
 *
 * SOURCE 2 — APRA, ADI licensing guidelines. Verified verbatim:
 *   · "If your business is only proposing to provide finance and is not
 *     proposing to take deposits then you do not require an ADI licence from
 *     APRA."
 *   · "However your business may still be required to be registered by APRA
 *     under the Financial Sector (Collection of Data) Act 2001."
 *   The second sentence must always travel with the first. Quoting only the
 *   first would imply APRA has no interest at all, which is not what the page
 *   says.
 *
 * SOURCE 3 — CPS 230, apra.gov.au/standards/cps-230. Verified verbatim, and
 * the version matters. The instrument now in force is "Banking, Insurance,
 * Life Insurance, Health Insurance and Superannuation (prudential standard)
 * determination No. 1 of 2026", and it says "This Prudential Standard commences
 * on 1 July 2026." The widely-cited 1 July 2025 instrument is superseded.
 *   · Application, verbatim: "This Prudential Standard applies to all
 *     APRA-regulated entities defined as: authorised deposit-taking
 *     institutions (ADIs) ... general insurers ... life companies ... private
 *     health insurers ... and registrable superannuation entity licensees (RSE
 *     licensees) under the SIS Act."
 *   · "Material service providers are those on which the entity relies to
 *     undertake a critical operation or that expose it to material operational
 *     risk."
 *   · "An APRA-regulated entity must not rely on a service provider unless it
 *     can ensure that in doing so it can continue to meet its prudential
 *     obligations in full and effectively manage the associated risks."
 *
 * SOURCE 4 — ASIC Regulatory Guide 104, June 2022, minor updates March 2026.
 * The PDF would not parse through a normal fetch, so the text was extracted
 * from the downloaded file directly. Verified verbatim:
 *   · "outsource functions, but not your responsibility as a licensee"
 *   · RG 104.34: "If you outsource functions that relate to your AFS licence,
 *     you remain responsible for complying with your obligations as a
 *     licensee: see s769B."
 *   · RG 104.36: "we expect that you: (a) will have measures in place to ensure
 *     that due skill and care is taken in choosing suitable service providers;
 *     (b) can and will monitor the ongoing performance of service providers;
 *     and (c) will appropriately deal with any actions by service providers
 *     that breach service level agreements or your obligations as a licensee."
 *
 * Do NOT add:
 *   - The Banking Act Part number for the non-ADI lender rule-making power. The
 *     research flagged a discrepancy between "Part IIB" and "Part IIIB" and
 *     could not resolve it against a fetched copy of the Part heading. The
 *     reserve power is described in the article without a Part citation.
 *   - Any named bank's supplier code of conduct. The pack quoted one as
 *     evidence of flow-down but noted it was not re-fetched by the lead
 *     researcher. The flow-down point is made from the CPS 230 text instead,
 *     which is verified, and does not need a named example.
 *   - Any count of AFS or credit licensees. The pack's figures came from an
 *     ASIC report it recommended re-fetching, and ASIC labels them "total
 *     approved" rather than currently on the register.
 *   - Any statement about whether APRA has ever exercised the non-ADI lender
 *     reserve power. Only law-firm sources say it has not been used, and no
 *     APRA page confirming that was found.
 *   - Anything telling a reader which regulator covers them. Report only.
 */
export default {
  hero: {
    label: 'Insights',
    title: ['Who APRA', 'actually regulates'],
    intro: [
      'Firms holding a financial services or credit licence are routinely offered compliance products built around APRA prudential standards. APRA publishes the list of what it regulates, and the standards publish the list of who they bind. Both are worth reading before you buy anything.',
    ],
  },

  sections: [
    {
      kind: 'answer',
      body: [
        'APRA says it oversees banks, credit unions, building societies, general insurers and reinsurers, life insurers, private health insurers, friendly societies and most of the superannuation industry. Its prudential standards, including CPS 230 on operational risk and CPS 234 on information security, each open by naming the same classes of entity they apply to. A business that lends money without taking deposits, and that holds a licence from ASIC rather than an authorisation from APRA, does not appear in either list. That does not mean nothing applies. It means the framework that applies is a different one, run by a different regulator, and a product built around the prudential standards is answering a question the firm may not have been asked.',
      ],
    },

    {
      kind: 'prose',
      heading: 'What APRA says it regulates',
      body: [
        'APRA is direct about this on its own site, and the sentence is worth reading closely because it is a closed list rather than a description.',
      ],
    },

    {
      kind: 'quote',
      quote: 'APRA oversees banks, credit unions, building societies, general insurance and reinsurance companies, life insurers, private health insurers, friendly societies, and a large part of the superannuation industry. Each of these financial institutions is an APRA-regulated entity.',
      attribution: 'APRA, Who we are',
    },

    {
      kind: 'prose',
      body: [
        'The second sentence is the operative one. "APRA-regulated entity" is not a general description of a financial business. It is a defined term, and the definition is the list in front of it.',
        'APRA is equally direct in its licensing guidance about businesses that lend without taking deposits: "If your business is only proposing to provide finance and is not proposing to take deposits then you do not require an ADI licence from APRA."',
        'The same page carries a qualifier that belongs with it. Such a business "may still be required to be registered by APRA under the Financial Sector (Collection of Data) Act 2001." Registration for data collection is a different thing from prudential supervision, and quoting the first sentence without the second would overstate the distance.',
      ],
    },

    {
      kind: 'prose',
      heading: 'The standards name their own audience',
      body: [
        'You do not have to infer any of this. Each prudential standard opens with an Application paragraph, and it reads like a guest list.',
        'CPS 230 applies, in its own words, to deposit-taking institutions, general insurers, life companies, private health insurers and superannuation licensees. CPS 234 opens with the same five classes. Neither mentions credit licensees, financial services licensees generally, or technology suppliers.',
        'APRA describes its own role as "establishing and enforcing legally binding standards that apply to APRA-regulated entities". The standards bind the entities the standards name.',
      ],
    },

    {
      kind: 'prose',
      heading: 'A version trap worth knowing about',
      body: [
        'If you are reading about CPS 230 anywhere other than the instrument itself, check which one you are reading about.',
        'Most commentary describes the standard that commenced on 1 July 2025. The instrument currently in force is a later one, made as determination No. 1 of 2026, and its own text says it "commences on 1 July 2026". The earlier version is marked superseded on APRA\'s handbook.',
        'A great deal of consultant material still presents the superseded version as current. That is the sort of thing worth checking before paying for advice built on it.',
      ],
    },

    {
      kind: 'prose',
      heading: 'Why a supplier still ends up reading CPS 230',
      body: [
        'None of this means the standards are irrelevant to firms outside the perimeter, and the reason is contractual rather than statutory.',
        'CPS 230 requires an APRA-regulated entity to manage the parties it depends on. In its words, an entity "must not rely on a service provider unless it can ensure that in doing so it can continue to meet its prudential obligations in full and effectively manage the associated risks". The standard also defines material service providers as those the entity relies on for a critical operation or that expose it to material operational risk.',
        'The practical consequence is that banks and insurers push those requirements into their supplier agreements. A software company selling to a bank will find CPS 230 language in the contract, and will have to meet it.',
        'The distinction matters. It arrives through a contract you signed rather than through a standard that binds you, which changes who you negotiate with and what happens if you cannot meet a clause.',
      ],
    },

    {
      kind: 'prose',
      heading: 'The regulator that does cover licensed conduct',
      body: [
        'ASIC describes itself as Australia\'s integrated corporate, markets, financial services and consumer credit regulator, and it administers the Corporations Act and the National Consumer Credit Protection Act.',
        'Its guidance for licensees includes a line that does the same work the prudential standards do on outsourcing, and says it more briefly.',
      ],
    },

    {
      kind: 'quote',
      quote: 'You can outsource functions, but not your responsibility as a licensee.',
      attribution: 'ASIC Regulatory Guide 104, AFS licensing: Meeting the general obligations',
    },

    {
      kind: 'prose',
      body: [
        'RG 104.34 puts it again in full: "If you outsource functions that relate to your AFS licence, you remain responsible for complying with your obligations as a licensee."',
        'And RG 104.36 sets out what ASIC expects of a licensee that outsources: measures ensuring due skill and care in choosing suitable providers, the ability and willingness to monitor their ongoing performance, and appropriately dealing with any actions that breach service level agreements or the licensee\'s own obligations.',
        'Read that against an AI vendor. Choosing carefully, monitoring continuously, and acting when something goes wrong is the whole of it, and none of it can be handed to the supplier.',
      ],
    },

    {
      kind: 'list',
      heading: 'Worth checking before you buy compliance work',
      items: [
        'Ask which instrument the advice is built on, and read that instrument\'s Application paragraph yourself. It is a short list and it names who it binds.',
        'Ask whether an obligation reaches you through a standard or through a contract you have signed. Those are different problems with different remedies.',
        'Check the version. A great deal of current CPS 230 material describes an instrument that has been superseded.',
        'Separate what a regulator publishes from what a consultant says a regulator expects. Practice guides say so themselves: APRA states that they "do not themselves create enforceable requirements".',
        'If the answer genuinely matters to a decision you are making, that is a question for someone qualified to answer it rather than for a vendor selling the remedy.',
      ],
    },

    {
      kind: 'prose',
      heading: 'Why we publish this',
      body: [
        'We sell AI work to licensed firms, so we sit on the supplier side of exactly the arrangement described above. We have read these standards because clients ask us to meet clauses drawn from them.',
        'The reason to write it down is that the perimeter is published, in plain sentences, on the regulators\' own sites, and almost nobody quotes it. It is easier to sell readiness for a standard than to check whether the standard reaches the buyer.',
        'On what any of this means for a particular firm, we are partway through a law degree and that is the only claim we make. What APRA and ASIC have published is a matter of record and it is quoted above. What follows from it for you is a question for someone admitted to answer it.',
      ],
    },

    {
      kind: 'sources',
      heading: 'Sources',
      items: [
        {
          title: 'Who we are',
          publisher: 'Australian Prudential Regulation Authority. Source of the list of APRA-regulated entities and of APRA\'s standard-setting role.',
          year: '2026',
          url: 'https://www.apra.gov.au/who-we-are',
        },
        {
          title: 'Licensing guidelines for authorised deposit-taking institutions',
          publisher: 'APRA. Source of the statement on finance-only businesses and ADI licensing.',
          year: '2026',
          url: 'https://www.apra.gov.au/licensing-guidelines-for-authorised-deposit-taking-institutions',
        },
        {
          title: 'Prudential Standard CPS 230 Operational Risk Management',
          publisher: 'APRA. The version in force is determination No. 1 of 2026, commencing 1 July 2026.',
          year: '2026',
          url: 'https://www.apra.gov.au/standards/cps-230',
        },
        {
          title: 'Regulatory Guide 104: AFS licensing: Meeting the general obligations',
          publisher: 'ASIC, issued June 2022 with minor updates March 2026. Source of the outsourcing quotes.',
          year: '2026',
          url: 'https://www.asic.gov.au/regulatory-resources/find-a-document/regulatory-guides/rg-104-afs-licensing-meeting-the-general-obligations/',
        },
      ],
    },
  ],
};
