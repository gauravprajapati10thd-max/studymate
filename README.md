# StudyMate Starter Website

A responsive, blue-and-white educational website starter for StudyMate.

## Included in this starter
- Responsive home page
- Subject cards
- Sample MCQ quiz with answer feedback
- Local browser progress tracking
- English/Hindi hero text toggle
- Notes section placeholder
- Admin workflow placeholder

## Publish with GitHub Pages
1. Create a public GitHub repository named `studymate`.
2. Upload `index.html`, `styles.css`, `app.js`, and this README to the repository root.
3. Open repository **Settings → Pages**.
4. Under Build and deployment, choose **Deploy from a branch**.
5. Choose branch `main` and folder `/ (root)`, then Save.
6. Wait for GitHub Pages to publish the site. The URL will be shown in Settings → Pages.

## Important current limitations
This is a front-end starter, not the finished connected platform.
- Notes are not yet connected to Drive/Sheets.
- Admin upload is not enabled yet.
- Progress is stored only in the current browser using localStorage.
- Sample quiz questions are demonstration content.
- Do not add passwords, API secrets, or private admin credentials to front-end files.

Next development step: configure a secure Google Apps Script backend with an administrator allowlist and Google Drive/Sheets integration. Test permissions before publishing admin features.
