const CHECKS = [
  [/\.(ts|vue)$/, ['npm run type-check', 'npm run check:testids', 'npm run check:icons', 'npm run check:locales']],
  [/src\/i18n\/locales\/[^/]+\.json$/, ['npm run check:locales']],
  [/src\/theme\/palette\.json$/, ['npm run check:contrast']],
];

export default {
  '*': (files) => {
    const paths = files.map((file) => file.replaceAll('\\', '/'));
    return [...new Set(CHECKS.flatMap(([pattern, commands]) => (paths.some((path) => pattern.test(path)) ? commands : [])))];
  },
};
