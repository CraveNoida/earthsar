const path = require("path");
const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const config = require("./config");
const { migrate } = require("./db");
const { bootstrapAdmin } = require("./auth");

const app = express();
const PUBLIC = path.join(__dirname, "..", "public");

// Hosts such as Render, Railway and Heroku sit behind one proxy.
app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "blob:", "https:"],
        mediaSrc: ["'self'", "blob:", "https:"],
        frameSrc: ["https://www.youtube-nocookie.com", "https://player.vimeo.com"],
        connectSrc: ["'self'"],
        upgradeInsecureRequests: config.isProd ? [] : null
      }
    },
    crossOriginEmbedderPolicy: false
  })
);
app.use(compression());
app.use(cookieParser());

app.use("/api", require("./routes/public"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api", (req, res) => res.status(404).json({ error: "Not found." }));

function siteOrigin(req) {
  return config.siteUrl || `${req.protocol}://${req.get("host")}`;
}

app.get("/robots.txt", (req, res) => {
  const origin = siteOrigin(req);
  res.type("text/plain").send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${origin}/sitemap.xml
`);
});

app.get("/sitemap.xml", (req, res) => {
  const origin = siteOrigin(req);
  const today = new Date().toISOString().slice(0, 10);
  const urls = [["", "1.0"]];
  res.type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([path, priority]) => `  <url>
    <loc>${origin}/${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`).join("\n")}
</urlset>
`);
});

// Keep the admin panel out of search engines.
app.use("/admin", (req, res, next) => {
  res.set("X-Robots-Tag", "noindex, nofollow");
  next();
});
app.use(
  express.static(PUBLIC, {
    extensions: ["html"],
    setHeaders(res, file) {
      // HTML, CSS and JS change with each release; images rarely do.
      if (/\.(html|css|js)$/.test(file)) res.set("Cache-Control", "no-cache");
      else res.set("Cache-Control", "public, max-age=604800");
    }
  })
);
app.use((req, res) => res.status(404).sendFile(path.join(PUBLIC, "index.html")));

// One place that turns errors into JSON the front end can show.
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const msg =
      err.code === "LIMIT_FILE_SIZE"
        ? "One of the files is too large."
        : err.code === "LIMIT_UNEXPECTED_FILE"
          ? "Too many files, or a file was sent in the wrong field."
          : "The upload could not be read.";
    return res.status(400).json({ error: msg });
  }
  if (err.expose || err.type === "entity.parse.failed") {
    return res.status(err.status || 400).json({ error: err.expose && err.message ? err.message : "The request could not be read." });
  }
  console.error(err);
  res.status(500).json({ error: "Something went wrong on the server. Try again in a moment." });
});

async function start() {
  await migrate();
  await bootstrapAdmin();
  return new Promise(resolve => {
    const server = app.listen(config.port, () => {
      console.log(`earthsar running on http://localhost:${config.port}  (admin: /admin)`);
      resolve(server);
    });
  });
}

if (require.main === module) {
  start().catch(err => {
    console.error("Could not start:", err.message);
    process.exit(1);
  });
}

module.exports = { app, start };
