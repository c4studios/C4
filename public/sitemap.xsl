<?xml version="1.0" encoding="UTF-8"?>
<!--
  Cosmetic stylesheet for sitemap.xml — renders the raw XML as a readable
  table when opened in a browser. Search engines ignore this entirely and
  parse the underlying <urlset>. Referenced via an <?xml-stylesheet?>
  processing instruction injected by scripts/prerender.mjs.
-->
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>C4 Studios — XML Sitemap</title>
        <style>
          :root {
            --bg:#0F1115; --card:#161922; --line:#262b36;
            --text:#ECE7DE; --muted:#9aa1ad; --accent:#B33A3A;
          }
          * { box-sizing:border-box; }
          body {
            margin:0; background:var(--bg); color:var(--text);
            font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,system-ui,sans-serif;
            -webkit-font-smoothing:antialiased;
          }
          .wrap { max-width:1080px; margin:0 auto; padding:48px 24px 80px; }
          .eyebrow {
            font-size:11px; letter-spacing:.28em; text-transform:uppercase; color:var(--muted);
          }
          .eyebrow::before {
            content:""; display:inline-block; width:28px; height:1px;
            background:var(--accent); margin-right:12px; transform:translateY(-3px);
          }
          h1 { font-size:28px; font-weight:600; letter-spacing:-.02em; margin:14px 0 6px; }
          .sub { color:var(--muted); font-size:14px; margin:0 0 28px; }
          .sub a { color:var(--text); text-decoration:none; border-bottom:1px solid var(--line); }
          .sub a:hover { color:var(--accent); }
          table { width:100%; border-collapse:collapse; font-size:13px; }
          th {
            text-align:left; font-size:10.5px; letter-spacing:.16em; text-transform:uppercase;
            color:var(--muted); font-weight:500; padding:0 14px 10px; border-bottom:1px solid var(--line);
          }
          td { padding:11px 14px; border-bottom:1px solid var(--line); vertical-align:top; }
          tr:hover td { background:var(--card); }
          a.loc { color:var(--text); text-decoration:none; word-break:break-all; }
          a.loc:hover { color:var(--accent); }
          .num { color:var(--muted); text-align:right; white-space:nowrap; }
          .meta { color:var(--muted); white-space:nowrap; }
          footer { margin-top:28px; color:var(--muted); font-size:12px; }
        </style>
      </head>
      <body>
        <div class="wrap">
          <div class="eyebrow">C4 Studios · Perth</div>
          <h1>XML Sitemap</h1>
          <p class="sub">
            <xsl:value-of select="count(s:urlset/s:url)"/> URLs ·
            a machine-readable index for search engines ·
            <a href="https://c4studios.com.au/">c4studios.com.au</a>
          </p>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>URL</th>
                <th>Priority</th>
                <th>Frequency</th>
                <th>Last modified</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="s:urlset/s:url">
                <tr>
                  <td class="num"><xsl:value-of select="position()"/></td>
                  <td><a class="loc" href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
                  <td class="meta"><xsl:value-of select="s:priority"/></td>
                  <td class="meta"><xsl:value-of select="s:changefreq"/></td>
                  <td class="meta"><xsl:value-of select="s:lastmod"/></td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
          <footer>Styling is cosmetic and ignored by crawlers — they read the raw XML.</footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
