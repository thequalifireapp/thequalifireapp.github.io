# Qualifire public site (for GitHub Pages)

This folder is the content of a SEPARATE, PUBLIC GitHub repo. It is not part of the private app repo.
Keep this README out of the public repo if you prefer (delete it after copying), nothing links to it.

Files: `index.html` (app page), `privacy.html` (generated from `../PRIVACY-POLICY.md`), `style.css`, `theme.js`,
`favicon.svg`, `.nojekyll`.

## Before you publish

1. Fill the 3 highlighted `[FILL IN ...]` items in `../PRIVACY-POLICY.md` (date, name on the Play listing,
   Sentry retention period).
2. Rebuild the page: `python "C:\Users\natha\Claude personal projects\Qualifire\deployment\rounds\round4\build-privacy-page.py"`
3. Check no yellow-highlighted text is left: open `privacy.html` in a browser.

## Publish (GitHub Desktop)

This folder (`round4\site`) is the master. The public repo folder is only a copy.

1. Copy it over (first run also creates the folder):
   `powershell -ExecutionPolicy Bypass -File "C:\Users\natha\Claude personal projects\Qualifire\deployment\rounds\round4\publish-site.ps1"`
   (add `-AllowPlaceholders` for a test push before the policy is filled in)
2. First time only: GitHub Desktop, File, Add local repository, pick
   `C:\Users\natha\Claude personal projects\thequalifireapp.github.io`, "create a repository", then Publish
   repository as `thequalifireapp.github.io` with "Keep this code private" unticked. Then on github.com:
   Settings, Pages, Deploy from a branch, `main`, `/ (root)`.
3. Every later update: run the script again, then GitHub Desktop: Commit to main, Push origin.

Site URL: https://thequalifireapp.github.io/  Privacy policy URL for the Console: https://thequalifireapp.github.io/privacy.html
