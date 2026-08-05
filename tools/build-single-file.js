#!/usr/bin/env node
/* ==========================================================================
   build-single-file.js — inline every stylesheet, script and icon into one
   self-contained HTML file.

     node tools/build-single-file.js

   Writes dist/stacks.html. That single file is the whole app: put it on a
   phone (Files, Drive, iCloud, email it to yourself) and open it. No server,
   no hosting, no network.

   Trade-off vs the hosted version: no service worker and no home-screen
   install, because both need an http(s) origin.
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'dist');
const OUT = path.join(OUT_DIR, 'stacks.html');

const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');

let html = read('index.html');

/* ---- inline <link rel="stylesheet"> ---------------------------------- */
html = html.replace(/<link rel="stylesheet" href="([^"]+)">/g, (m, href) => {
  const css = read(href);
  console.log('  css   ', href, (css.length / 1024).toFixed(1) + ' kB');
  return `<style>\n/* ${href} */\n${css}\n</style>`;
});

/* ---- inline <script src> --------------------------------------------- */
html = html.replace(/<script src="([^"]+)"><\/script>/g, (m, src) => {
  const js = read(src);
  console.log('  js    ', src, (js.length / 1024).toFixed(1) + ' kB');
  // </script> inside a string literal would end the tag early
  return `<script>\n/* ${src} */\n${js.replace(/<\/script>/gi, '<\\/script>')}\n</script>`;
});

/* ---- inline the apple-touch icon as a data URI ----------------------- */
html = html.replace(/<link rel="apple-touch-icon" href="([^"]+)">/g, (m, href) => {
  const b64 = fs.readFileSync(path.join(ROOT, href)).toString('base64');
  return `<link rel="apple-touch-icon" href="data:image/png;base64,${b64}">`;
});

/* ---- drop what cannot work from a single local file ------------------ */
// the manifest and service worker both need a real http(s) origin
html = html.replace(/<link rel="manifest"[^>]*>\n?/g, '');
html = html.replace(/<script>\n\/\/ Offline support[\s\S]*?<\/script>\n?/g,
  '<!-- service worker omitted: the single-file build has no origin to scope it to -->\n');

/* ---- make it obvious which build this is ---------------------------- */
html = html.replace('<title>Stacks — PAL\'s Academy</title>',
  '<title>Stacks — PAL\'s Academy</title>\n<!-- single-file build: ' +
  new Date().toISOString().slice(0, 10) + ' -->');

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT, html);

const kb = (fs.statSync(OUT).size / 1024).toFixed(0);
console.log(`\n✓ dist/stacks.html — ${kb} kB, fully self-contained.`);
console.log('  Copy it to your phone and open it. Everything is inside that one file.');
