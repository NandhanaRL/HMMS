const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const docsDir = __dirname;
const mdFile = path.join(docsDir, 'HMMS_Software_Requirements_Specification.md');
const rawHtmlFile = path.join(docsDir, 'raw_body.html');
const outputHtmlFile = path.join(docsDir, 'HMMS_Software_Requirements_Specification.html');

console.log('Compiling Markdown to HTML via marked...');
execSync(`npx -y marked -i "${mdFile}" -o "${rawHtmlFile}"`, { stdio: 'inherit' });

let rawBody = fs.readFileSync(rawHtmlFile, 'utf8');

// Replace chapter H1s with <h1 class="chapter-break"> so only chapters break to a new page
rawBody = rawBody.replace(/<h1>([1-6]\..*?|Appendix.*?)<\/h1>/gi, '<h1 class="chapter-break">$1</h1>');

// Wrap the initial title and metadata into a non-breaking cover-header card
// Match the first h1, h2, and following metadata paragraph
const titlePattern = /<h1>Software Requirements Specification<\/h1>\s*<h2>for Hostel &amp; Mess Management System \(HMMS\)<\/h2>\s*(<p>[\s\S]*?<\/p>)/i;

if (titlePattern.test(rawBody)) {
  rawBody = rawBody.replace(titlePattern, (match, metaParagraph) => {
    return `
<div class="cover-card">
  <div class="cover-badge">ENTERPRISE SYSTEM SPECIFICATION</div>
  <h1 class="cover-title">Hostel &amp; Mess Management System (HMMS)</h1>
  <div class="cover-subtitle">Software Requirements Specification (IEEE 830-1998 Standard)</div>
  <div class="cover-meta-box">
    ${metaParagraph}
  </div>
</div>`;
  });
}

const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HMMS - Software Requirements Specification</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

    @page {
      size: A4;
      margin: 15mm 15mm 15mm 15mm;
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 10.5pt;
      line-height: 1.6;
      color: #1e293b;
      background-color: #ffffff;
      margin: 0;
      padding: 20px 30px;
    }

    @media print {
      body {
        padding: 0;
        color: #0f172a;
      }
      .no-print {
        display: none !important;
      }
      h1, h2, h3, h4 {
        page-break-after: avoid;
        break-after: avoid;
      }
      table, pre, blockquote, ul, ol, .cover-card {
        page-break-inside: avoid;
        break-inside: avoid;
      }
      h1 {
        page-break-before: avoid;
        break-before: avoid;
      }
      h1.chapter-break {
        page-break-before: always !important;
        break-before: page !important;
        padding-top: 15px;
      }
    }

    /* Print instruction banner */
    .print-banner {
      background: #0f172a;
      border: 1px solid #1e293b;
      color: #f8fafc;
      padding: 16px 20px;
      border-radius: 10px;
      margin-bottom: 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
    }
    .banner-text {
      flex: 1;
    }
    .banner-title {
      font-size: 15px;
      margin-bottom: 4px;
      color: #ffffff;
    }
    .banner-desc {
      font-size: 13px;
      color: #94a3b8;
      line-height: 1.5;
    }
    .banner-desc strong {
      color: #f59e0b;
    }
    .print-btn {
      background: #2563eb;
      color: white;
      border: none;
      padding: 10px 22px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.15s ease;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }
    .print-btn:hover {
      background: #1d4ed8;
    }

    /* Professional Cover Page Card */
    .cover-card {
      background: #ffffff;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      padding: 30px 32px;
      margin-bottom: 25px;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .cover-badge {
      display: inline-block;
      font-size: 9pt;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #2563eb;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      padding: 4px 12px;
      border-radius: 20px;
      margin-bottom: 14px;
    }
    .cover-title {
      font-size: 24pt !important;
      font-weight: 800 !important;
      color: #0f172a !important;
      border-bottom: none !important;
      margin: 0 0 8px 0 !important;
      padding: 0 !important;
      line-height: 1.25 !important;
    }
    .cover-subtitle {
      font-size: 13pt;
      font-weight: 600;
      color: #475569;
      margin-bottom: 22px;
    }
    .cover-meta-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px 18px;
    }
    .cover-meta-box p {
      margin: 0;
      line-height: 1.8;
      font-size: 10pt;
      color: #334155;
    }

    h1 {
      font-size: 18pt;
      font-weight: 700;
      color: #0f172a;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 6px;
      margin-top: 22pt;
      margin-bottom: 12pt;
    }

    h2 {
      font-size: 13.5pt;
      font-weight: 600;
      color: #1e293b;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 4px;
      margin-top: 18pt;
      margin-bottom: 8pt;
    }

    h3 {
      font-size: 11.5pt;
      font-weight: 600;
      color: #334155;
      margin-top: 14pt;
      margin-bottom: 6pt;
    }

    h4 {
      font-size: 10.5pt;
      font-weight: 600;
      color: #475569;
      margin-top: 10pt;
      margin-bottom: 4pt;
    }

    p {
      margin-top: 0;
      margin-bottom: 10pt;
      text-align: justify;
    }

    ul, ol {
      margin-top: 0;
      margin-bottom: 10pt;
      padding-left: 24px;
    }

    li {
      margin-bottom: 4pt;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 14pt 0;
      font-size: 9.5pt;
    }

    th, td {
      border: 1px solid #cbd5e1;
      padding: 7pt 9pt;
      text-align: left;
      vertical-align: top;
    }

    th {
      background-color: #f1f5f9;
      color: #0f172a;
      font-weight: 600;
    }

    tr:nth-child(even) td {
      background-color: #f8fafc;
    }

    code {
      font-family: 'JetBrains Mono', 'Fira Code', Consolas, Monaco, monospace;
      font-size: 8.8pt;
      background-color: #f1f5f9;
      color: #0f172a;
      padding: 1.5px 5px;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }

    pre {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 10pt 14pt;
      overflow-x: auto;
      margin: 12pt 0;
    }

    pre code {
      background-color: transparent;
      padding: 0;
      border: none;
      font-size: 8.5pt;
      line-height: 1.45;
      color: #334155;
    }

    blockquote {
      border-left: 4px solid #3b82f6;
      background-color: #eff6ff;
      padding: 8pt 14pt;
      margin: 12pt 0;
      border-radius: 0 6px 6px 0;
      color: #1e3a8a;
    }

    hr {
      border: none;
      border-top: 1px solid #e2e8f0;
      margin: 20pt 0;
    }

    a {
      color: #2563eb;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="print-banner no-print">
    <div class="banner-text">
      <div class="banner-title">📄 <strong>Ready to Save as PDF</strong></div>
      <div class="banner-desc">
        👉 <strong>To remove the Date &amp; Time from the top:</strong> In Print Settings &rarr; Click <strong>"More settings"</strong> &rarr; <strong>Uncheck "Headers and footers"</strong>.<br>
        👉 Make sure <strong>"Background graphics"</strong> is <strong>checked</strong> for table styles.
      </div>
    </div>
    <button class="print-btn" onclick="window.print()">Print to PDF (Ctrl + P)</button>
  </div>
  ${rawBody}
</body>
</html>`;

fs.writeFileSync(outputHtmlFile, htmlTemplate, 'utf8');
if (fs.existsSync(rawHtmlFile)) {
  fs.unlinkSync(rawHtmlFile);
}
console.log('Successfully generated styled HTML file at:', outputHtmlFile);
