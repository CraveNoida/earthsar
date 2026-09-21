# Earthsar website

Static website for **Earthsar — Smart Advisors In Real Estate**.
Plain HTML, CSS and JavaScript. No build step and no framework.

## Files

```
index.html              Page structure and copy
css/styles.css          All styling (brand tokens at the top)
js/config.js            ← Edit this to update content
js/main.js              Behaviour: carousel, counters, reviews, forms, modals
assets/earthsar-logo.svg  Official logo (vector, original colours)
images/                 Put hero, team, partner and review photos here
```

## Updating content

Open `js/config.js` and fill in:

- **stats**: years, clients, associations, satisfaction. Empty values show as "XX".
- **contact**: phone, email, address, hours.
- **partners**: associated companies (name, website, logo path). The order in the file is the order on the site.
- **credentials**: genuine registrations, certifications, memberships and awards.
- **team**: advisor profiles and photos.
- **reviews**: confirmed client reviews. Visitor submissions arrive by email first, so you can check them before adding them here.
- **heroImage**: optional photo to replace the architectural illustration.
- **legal**: links to your privacy, terms and disclaimer pages.

## Setting up the forms

Because the site is static, the enquiry and review forms send submissions to a form service.

1. Create a form at https://formspree.io (or Web3Forms, Getform, Basin, and similar services).
2. Copy the endpoint URL, e.g. `https://formspree.io/f/abcdwxyz`.
3. Paste it into `forms.enquiryEndpoint` and `forms.reviewEndpoint` in `js/config.js`.

Photo and video attachments on reviews need a plan that accepts file uploads.
Most free plans only accept text; in that case visitors can still share a YouTube or Vimeo link.

If no endpoint is set and an email is set in `contact`, the enquiry form opens the visitor's email app instead.

## Hosting

Upload the whole folder to any static host: Netlify, Vercel, GitHub Pages, Cloudflare Pages,
or regular shared hosting (upload through cPanel or FTP into `public_html`).

To preview locally, run a simple server from this folder:

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Brand colours

| Token | Value | Use |
|---|---|---|
| `--es-blue` | #004AAD | Trust: headings, navigation, statistics |
| `--es-orange` | #F1770A | Action: buttons, highlights, stars |
| `--soft-blue` | #F4F8FF | Section backgrounds |
| `--soft-orange` | #FFF6EE | Accent backgrounds |
| `--ink` | #182433 | Body text |

Fonts: Outfit (headings) and Manrope (body), loaded from Google Fonts.
