# Mattia Borchi — Portfolio

A self-contained static website with five pages: Home, About, Contacts, Disclaimer and Terms and Conditions. All images, icons, fonts and downloads are included. No package installation, server application or external scripts are required.

Contact: **mattia.borchi.career@gmail.com**

## Preview and check

With Node.js 22 or later, run these commands from this folder:

```sh
node scripts/check.mjs
node scripts/preview.mjs
```

Open `http://127.0.0.1:4173/`. Stop the preview with Ctrl+C. A static HTTP server can also serve the HTML files directly.

## Upload to GitHub

1. Create a repository with `main` as its default branch.
2. Upload **the contents of this folder** to the repository root, including `.github/workflows/pages.yml` and `.nojekyll`.
3. In the repository's **Settings → Pages**, choose **GitHub Actions** as the publishing source.
4. Run the included workflow, or push an update to `main`. It checks the files, prepares `dist/`, and publishes it.

The workflow obtains the actual Pages URL automatically and uses it for canonical metadata, the sitemap and the 404 home link. No domain is hard-coded. Relative navigation and media links work on repository paths and domain roots.

## Build for another static host

```sh
node scripts/build.mjs
```

Upload the generated `dist/` directory. To generate a sitemap and canonical URLs, set `SITE_URL` to the final public URL before building. In PowerShell:

```powershell
$env:SITE_URL = 'https://YOUR-ACCOUNT.github.io/YOUR-REPOSITORY/'
node scripts/build.mjs
node scripts/preview.mjs --dist
```

Without `SITE_URL`, the build works on any host and omits URL-specific metadata and the sitemap. The workflow sets this value automatically for GitHub Pages.

## Edit the site

- Page text: the relevant `index.html`.
- Shared appearance: `assets/site.css`.
- Mobile menu: `assets/site.js`.
- Photos and logos: `assets/images/`; icons: `assets/icons/`.
- Font: `assets/fonts/`; downloadable PDFs: `assets/documents/`.
- Header and footer are static HTML repeated on each page; update all five when changing navigation.
- After editing Terms and Conditions, update its downloadable PDF to match.

The site uses no analytics, tracking scripts, cookies or browser storage. Email and professional-profile links open their destinations only when selected. `dist/` is generated and excluded from source control.
