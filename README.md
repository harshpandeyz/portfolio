# Harsh Pandey Portfolio

Production-ready developer portfolio for Harsh Pandey, focused on full-stack development, backend engineering, AI systems, blockchain evidence logging, and secure REST APIs.

## Structure

```text
portfolio/
├── index.html
├── 404.html
├── projects/
│   └── index.html
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
├── data/
│   ├── skills.js
│   ├── projects.js
│   └── certificates.js
└── netlify.toml
```

## Local Preview

This is a static HTML/CSS/JS project. Serve it from the project root so data files and certificate previews load correctly.

```bash
python -m http.server 4173
```

Then open `http://localhost:4173`.

## Notes

- Skills, projects, and certificates are centralized in `data/`.
- Certificate PDF thumbnails are rendered with PDF.js.
- Contact form UI is wired for Formspree. Replace `YOUR_FORM_ID` in `index.html` with the live Formspree form ID before deployment.
