# Harsh Pandey Portfolio

Production-ready static portfolio for Harsh Pandey, focused on full-stack development, backend engineering, AI systems, blockchain evidence logging, and secure REST APIs.

## Structure

```text
portfolio/
|-- index.html
|-- 404.html
|-- netlify.toml
|-- projects/
|   `-- index.html
|-- data/
|   |-- skills.js
|   |-- projects.js
|   `-- certificates.js
`-- assets/
    |-- css/
    |   |-- style.css
    |   |-- responsive.css
    |   |-- certificates.css
    |   |-- projects.css
    |   `-- 404.css
    |-- js/
    |   |-- main.js
    |   |-- projects.js
    |   `-- certificates.js
    `-- images/
        |-- about/
        |-- certificates/
        |-- education/
        |-- hero/
        |-- favicon.png
        `-- hero.png
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
- The contact form opens a prefilled email addressed to `harshap17058@gmail.com`.
- Generated validation screenshots should stay out of the repo via `.gitignore`.
