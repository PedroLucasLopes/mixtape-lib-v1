import { readFileSync } from 'node:fs';

const palette = JSON.parse(readFileSync(new URL('../src/theme/palette.json', import.meta.url), 'utf8'));

const parse = (color) => {
  const rgba = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/.exec(color);
  if (rgba) return { r: +rgba[1], g: +rgba[2], b: +rgba[3], a: rgba[4] === undefined ? 1 : +rgba[4] };
  const hex = color.replace('#', '');
  return { r: parseInt(hex.slice(0, 2), 16), g: parseInt(hex.slice(2, 4), 16), b: parseInt(hex.slice(4, 6), 16), a: 1 };
};

const over = (top, bottom) => {
  const a = parse(top);
  const b = parse(bottom);
  const mix = (x, y) => Math.round(x * a.a + y * (1 - a.a));
  return `#${[mix(a.r, b.r), mix(a.g, b.g), mix(a.b, b.b)].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
};

const luminance = (color) => {
  const { r, g, b } = parse(color);
  const channel = (v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

const ratio = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

const TEXT = 4.5;
const UI = 3;
const DECORATIVE = 1.4;

let failures = 0;

const report = (title, pairs) => {
  console.log(`\n--- ${title} ---`);
  for (const [label, foreground, background, minimum] of pairs) {
    const value = ratio(foreground, background);
    const ok = value >= minimum;
    if (!ok) failures += 1;
    console.log(`  ${ok ? 'OK   ' : 'LOW  '} ${label.padEnd(44)} ${value.toFixed(2).padStart(5)}:1  (min ${minimum})`);
  }
};

for (const [name, theme] of Object.entries(palette.themes)) {
  const glassOver = (backdrop) => over(theme.glass, backdrop);
  const blobs = Object.entries(palette.brand).filter(([key]) => !['ink', 'paper'].includes(key));

  report(`theme ${name}`, [
    ['text on surface', theme.onSurface, theme.surface, TEXT],
    ['text on background', theme.onSurface, theme.background, TEXT],
    ['text on background alt', theme.onSurface, theme.backgroundAlt, TEXT],
    ['text on surface variant', theme.onSurface, theme.surfaceVariant, TEXT],
    ['muted text on surface', theme.onSurfaceMuted, theme.surface, TEXT],
    ['muted text on background', theme.onSurfaceMuted, theme.background, TEXT],
    ['muted text on surface variant', theme.onSurfaceMuted, theme.surfaceVariant, TEXT],
    ['link on surface', theme.link, theme.surface, TEXT],
    ['link on background', theme.link, theme.background, TEXT],
    ['primary on surface', theme.primary, theme.surface, UI],
    ['on-primary on primary', theme.onPrimary, theme.primary, TEXT],
    ['secondary on surface', theme.secondary, theme.surface, UI],
    ['on-secondary on secondary', theme.onSecondary, theme.secondary, TEXT],
    ['tertiary on surface', theme.tertiary, theme.surface, UI],
    ['on-tertiary on tertiary', theme.onTertiary, theme.tertiary, TEXT],
    ['on-cta on cta', theme.onCta, theme.cta, TEXT],
    ['cta outline on background', theme.ctaOutline, theme.background, UI],
    ['success on surface', theme.success, theme.surface, UI],
    ['warning on surface', theme.warning, theme.surface, UI],
    ['error on surface', theme.error, theme.surface, UI],
    ['on-error on error', theme.onError, theme.error, TEXT],
    ['info on surface', theme.info, theme.surface, UI],
    ['focus ring on background', theme.focus, theme.background, UI],
    ['outline on surface', theme.outline, theme.surface, DECORATIVE],
    ['strong outline on surface', theme.outlineStrong, theme.surface, UI],
    ['text on glass over background', theme.onSurface, glassOver(theme.background), TEXT],
    ['muted text on glass over background', theme.onSurfaceMuted, glassOver(theme.background), TEXT],
    ...blobs.map(([blob, color]) => [`text on glass over ${blob} blob`, theme.onSurface, glassOver(color), TEXT]),
  ]);
}

report(
  'duotones (ink on background)',
  Object.entries(palette.duotones).map(([name, duotone]) => [name, duotone.ink, duotone.background, TEXT]),
);

console.log(`\n${failures === 0 ? 'palette approved' : `${failures} pair(s) below the minimum`}`);
process.exitCode = failures === 0 ? 0 : 1;
