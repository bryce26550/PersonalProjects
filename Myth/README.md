# Morana’s Campaign — Single Page

This is a small, dark-themed single-page website built with HTML, CSS and JavaScript. It is a static mockup for "Morana’s Campaign: Ruler of the Dead." It contains a hero with snow animation, an about section, stylized campaign promises, a mock pledge form, and a footer with mystical symbols.

How to view
- Open `index.html` in your browser (double-click or use your editor's Live Server).

Notes
- Snow effect is implemented with a canvas in `js/main.js`.
- Fonts are loaded from Google Fonts (Playfair Display for titles, Inter for body). Internet connection required to fetch fonts.
- The pledge form is a mock UI and does not send data to a server; submission shows a local confirmation.

Files added
- `index.html` — main markup with comments for each section.
- `css/styles.css` — theme, layout, responsive rules, and subtle animations.
- `js/main.js` — snow canvas + form interactions.
- `assets/morana.svg` — scalable silhouette used in the hero.

Note about swapping to JPG
- This project previously used an inline SVG for the hero. If you'd like to use a high-detail JPG instead, place your image at `assets/morana.jpg`. The HTML now references that path by default. If you want to restore the SVG animation later, you can replace the `<img>` in `index.html` with the inline SVG and update `css/styles.css` selectors.

License
- Free to use and adapt for demo or portfolio purposes.
