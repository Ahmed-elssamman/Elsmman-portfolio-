# CV content review

Reviewed 16 September 2026. No `AGENTS.md` file was present in the repository root; the coding rules supplied in the conversation were followed.

## Sources and selection

- `Ahmed_ElSamman_Frontend_Engineer_CV.pdf`: two pages, created 2 September 2026. Selected as the primary content source and the downloadable CV at `public/ahmed-elsamman-cv.pdf`.
- `Ahmed_ElSamman_Vodafone_Frontend_CV_Black.docx`: modified 2 September 2026. Its experience, education, and certification content agrees with the selected frontend PDF.
- `Ahmed_ElSamman_software_Engineer_CV.pdf`: two pages, created 1 September 2026. Used to cross-check facts and recover embedded contact links.

PDF text and link annotations were extracted locally with `pdf-parse` in a temporary directory outside the project. Word text was read from its document XML. No application dependencies were added.

## Conflicts resolved

| Detail | Newer frontend PDF and Word CV | Older software PDF | Portfolio choice |
| --- | --- | --- | --- |
| Ayen start | November 2024 | August 2024 | November 2024: two agreeing, newer sources |
| Sys Gate start | September 2023 | March 2023 | September 2023: two agreeing, newer sources |
| Ayen and ITI end | February 2026 | February 2026 | February 2026; replaces stale “Present” in existing JSON |
| Medica Scope title | Frontend Engineer | Frontend Engineer | Frontend Engineer; removes the old “Mid” prefix |
| LinkedIn | `ahmed-elssamman-825815427` as visible text | Full matching URL embedded in a link | `https://www.linkedin.com/in/ahmed-elssamman-825815427/`; replaces the old uncorroborated `/ahmedelssamman/` URL |

ESquare, a remote part-time frontend role from July 2026 to present, appears in all three files and was added to the experience data. Medica Scope begins in February 2026 and remains current in all three sources. Medica Scope is listed first as the main role, followed by the current part-time ESquare role.

## Editorial decisions

- Used a concise first-person profile with three short supporting narratives.
- Replaced unsupported percentage improvements and student counts from the old portfolio with specific work supported by the CVs. No numerical impact or seniority claims were added.
- Used unversioned framework names where the newer CV does not specify a version.
- Retained the existing availability intent, phrased as “Open to frontend opportunities”; availability is existing portfolio content rather than a CV claim.
- Left employment type blank where the CV does not specify it. ESquare is explicitly part-time.
- Education dates and both Udemy course names/years agree across all sources. Education and certifications are listed newest first.
- Arabic native and English professional working proficiency are explicitly recorded in the older software PDF; the newer files list both languages without levels.
- GitHub, email, and phone agree across all sources. The resume URL points to the chosen local PDF.
- Source CV metadata references Vodafone, but the selected PDF’s visible body is a general frontend CV. It was copied unchanged, not rewritten.

## Verification

- Confirmed all four JSON resources conform to their existing Zod schemas.
- Confirmed the public PDF is byte-identical to the selected source.
- Confirmed experience bullet counts do not exceed four and the profile includes three narratives.

