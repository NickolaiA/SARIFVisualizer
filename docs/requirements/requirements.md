#What to build

##Data flow

- Input: upload a .sarif file (or fetch from your CI artifact storage).
- Parse: parse JSON; map runs, rules, and results.
- Enrich (optional): follow outbound links from rule.help.markdown/helpUri (often advisory pages from Snyk/others) and/or call CVE/CWE/NVD APIs.
- Visualize: charts and tables (severity, rules, files, packages, fix availability).
- Drill-down: per-finding view with code locations, snippets, related locations, and remediation guidance.

##Key SARIF fields to use
- runs[*].tool.driver.rules[*]: rule metadata, titles, categories, help.text/help.markdown, sometimes helpUri.
- runs[*].results[*]: individual issues (severity/level, message, locations, fixes, suppressions).
- runs[*].artifacts[*]: file paths; useful for grouping by file/repo.
- fixes (if present): suggested edits/patches for auto-fix scenarios.
- Spec references: SARIF 2.1.0 (OASIS) and schema. 

##Snyk + SARIF specifics
- Snyk CLI can output SARIF directly; its rules[*].help typically includes remediation steps and links to advisories, which you can render as external links from the UI. 

## React app architecture (quick plan)
- Stack: React + TypeScript + Vite (or Next.js), Zustand/Redux for state, React Router for views, Recharts for graphs, a Markdown renderer for help.markdown.
- Large files: parse in a Web Worker to keep UI responsive.
- Security: sanitize any markdown/HTML in help.markdown before rendering.
- Views
  - Upload/Select Build: pick a SARIF file or fetch from API.
  - Overview Dashboard: totals; issues by severity/rule/project/file; “fix available” vs “no fix”.
  - Rules Directory: list of rules with counts and links to helpUri / advisories.
  - Findings Explorer: filters (severity, rule, file, path, package), sorting, search.
  - Finding Detail: message, locations (file/region), code snippet (if available), remediation (from help), external links, and any fixes.
