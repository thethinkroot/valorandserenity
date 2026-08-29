// Renders a real tribute page from a real D1 record. v1, deliberately
// simple per the brief this was built from: name, dates, branch, photo,
// story, honors. Not Mike's full ten-section richness (unit history,
// service song, video, multi-photo gallery) - that's aspirational,
// documented in FIELD-MAPPING-SPEC.md, and later work, not this pass.
//
// Reuses the site's real design system rather than inventing one: the
// same CSS custom properties, the same branch color values, and the same
// class names (.cover-plaque, .cover-name, .section-inner, .eyebrow, .rule,
// etc.) already established on mike-mesarch.html and the example pages.

const BRANCH_THEMES = {
  Army: { slug: 'army', label: 'United States Army', copper: '#A8842A', copperDeep: '#816321', copperText: '#816321', aubergineDeep: '#1C1C1C' },
  Navy: { slug: 'navy', label: 'United States Navy', copper: '#9C8737', copperDeep: '#786829', copperText: '#786829', aubergineDeep: '#00205B' },
  'Marine Corps': { slug: 'marine-corps', label: 'United States Marine Corps', copper: '#A0182A', copperDeep: '#7c1220', copperText: '#7c1220', aubergineDeep: '#1C1C1C' },
  'Air Force': { slug: 'air-force', label: 'United States Air Force', copper: '#2F6FA8', copperDeep: '#24567F', copperText: '#24567F', aubergineDeep: '#00308F' },
  'Coast Guard': { slug: 'coast-guard', label: 'United States Coast Guard', copper: '#CE1126', copperDeep: '#a10d1e', copperText: '#a10d1e', aubergineDeep: '#003087' },
  'Space Force': { slug: 'space-force', label: 'United States Space Force', copper: '#6C6F76', copperDeep: '#52555B', copperText: '#52555B', aubergineDeep: '#1C1E22' },
};

const DEFAULT_THEME = { slug: 'default', label: '', copper: '#B66F4A', copperDeep: '#8B4E30', copperText: '#9C5C3A', aubergineDeep: '#29212B' };

function themeFor(branch) {
  return BRANCH_THEMES[branch] || DEFAULT_THEME;
}

function branchLine(record) {
  const theme = themeFor(record.branch);
  const label = theme.label || record.branch || '';
  const from = record.serviceFromYear ? escapeHtml(record.serviceFromYear) : '';
  const to = record.serviceToYear ? escapeHtml(record.serviceToYear) : '';
  const years = from || to ? `${from}&ndash;${to}` : '';
  if (label && years) return `${label} &middot; ${years}`;
  return label || years;
}

function datesLine(record) {
  const born = record.bornYear ? escapeHtml(record.bornYear) : '';
  if (record.subjectMode === 'passed') {
    const passed = record.passedYear ? escapeHtml(record.passedYear) : '';
    if (born && passed) return `${born}&ndash;${passed}`;
    return born || passed || '';
  }
  return born;
}

function storyParagraphs(storyText) {
  if (!storyText) return '';
  return storyText
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join('\n');
}

function honorsList(honors) {
  if (!honors || !honors.length) return '';
  const items = honors
    .filter((h) => h && h.trim())
    .map((h) => `<li>${escapeHtml(h)}</li>`)
    .join('\n');
  return items ? `<ul class="honors-list">${items}</ul>` : '';
}

export function renderTributePage(record, photoUrl) {
  const theme = themeFor(record.branch);
  const name = escapeHtml(record.fullName || 'Their Name');
  const dates = datesLine(record);
  const line = branchLine(record);
  const story = storyParagraphs(record.storyText);
  const honors = honorsList(record.honors);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${name} | Valor &amp; Serenity</title>
${record.noindex ? '<meta name="robots" content="noindex, nofollow">' : ''}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Lato:ital,wght@0,300;0,400;0,700;1,400&display=swap" rel="stylesheet">
<style>
  :root {
    --bone: #FAF8F3; --bone-warm: #F0E9DC; --bone-deep: #E1D5C0; --ink: #1D1C1B;
    --aubergine: #69545F; --aubergine-deep: ${theme.aubergineDeep};
    --copper: ${theme.copper}; --copper-deep: ${theme.copperDeep}; --copper-text: ${theme.copperText};
    --font-display: 'Cinzel', serif; --font-body: 'Lato', sans-serif;
  }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bone); color: var(--ink); font-family: var(--font-body); -webkit-font-smoothing: antialiased; }
  a { color: var(--copper-text); }
  img { max-width: 100%; display: block; }
  section { padding: 96px clamp(24px,5vw,64px); }
  .section-inner { max-width: 900px; margin: 0 auto; }
  .rule { width: 32px; height: 2px; background: var(--copper); margin: 0 auto 20px; }
  .eyebrow { font-size: 13px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--copper-text); margin: 0 0 18px; text-align: center; }
  h1, h2 { font-family: var(--font-display); font-size: clamp(28px,3.4vw,42px); font-weight: 500; color: var(--ink); margin: 0 0 20px; text-align: center; line-height: 1.25; }
  .section-lede { font-size: 17px; color: var(--aubergine); text-align: center; max-width: 560px; margin: 0 auto; line-height: 1.6; }
  .cover { background: var(--bone); }
  .cover-portrait { position: relative; width: 100%; height: 60vh; min-height: 360px; max-height: 640px; overflow: hidden; }
  .cover-portrait img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
  .cover-plaque { max-width: 640px; margin: 0 auto; text-align: center; padding: 52px 24px 56px; }
  .cover-branch-line { font-family: var(--font-body); font-size: 13px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--copper-text); margin: 0 0 18px; }
  .cover-name { font-family: var(--font-display); font-size: clamp(32px,4.6vw,50px); font-weight: 500; margin: 0 0 12px; color: var(--ink); }
  .cover-dates { font-family: var(--font-body); font-size: 15px; color: var(--aubergine); margin: 0 0 24px; }
  .cover-motif { width: 32px; height: 2px; background: var(--copper); margin: 24px auto 0; }
  #story, #honors { text-align: center; }
  #story p { font-size: 16.5px; color: var(--ink); line-height: 1.8; max-width: 640px; margin: 0 auto 20px; text-align: left; }
  #story p:last-child { margin-bottom: 0; }
  #honors { background: var(--bone-warm); }
  .honors-list { list-style: none; margin: 32px auto 0; padding: 0; max-width: 420px; display: flex; flex-direction: column; gap: 14px; }
  .honors-list li { font-size: 17px; color: var(--ink); background: var(--bone); border-radius: 4px; padding: 14px 20px; }
  footer { background: var(--aubergine-deep); padding: 48px clamp(24px,5vw,64px); text-align: center; }
  footer p { font-family: var(--font-display); font-style: italic; font-size: 14px; color: var(--bone-warm); margin: 0; }
  .report-link { font-family: var(--font-body); font-style: normal; font-size: 12.5px; color: rgba(240,233,220,0.55); margin: 20px 0 0; }
  .report-link a { color: rgba(240,233,220,0.75); text-decoration: underline; }
  .report-link a:hover { color: var(--bone); }
</style>
</head>
<body data-theme="${theme.slug}">
<main id="main-content">
<section class="cover" aria-label="${name}">
  ${photoUrl ? `<div class="cover-portrait"><img src="${photoUrl}" alt="${name}"></div>` : ''}
  <div class="cover-plaque">
    ${line ? `<p class="cover-branch-line">${line}</p>` : ''}
    <h1 class="cover-name">${name}</h1>
    ${dates ? `<p class="cover-dates">${dates}</p>` : ''}
    <div class="cover-motif"></div>
  </div>
</section>

${story ? `<section id="story">
  <div class="section-inner">
    <div class="rule"></div>
    <p class="eyebrow">Their Story</p>
    <h2>In Their Words</h2>
    ${story}
  </div>
</section>` : ''}

${honors ? `<section id="honors">
  <div class="section-inner">
    <div class="rule"></div>
    <p class="eyebrow">Honors</p>
    <h2>Medals and Recognitions</h2>
    ${honors}
  </div>
</section>` : ''}

</main>
<footer>
  <p>Valor &amp; Serenity</p>
  <p class="report-link"><a href="mailto:hello@valorandserenity.com?subject=${encodeURIComponent('Something not right on a tribute page (' + record.token + ')')}">Something not right on this page? Let us know</a></p>
</footer>
</body>
</html>`;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}
