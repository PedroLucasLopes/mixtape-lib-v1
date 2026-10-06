export type MessageParams = Readonly<Record<string, string | number>>;

const pluralIndex = (count: number, forms: number): number => {
  const value = Math.abs(count);
  if (forms === 2) return value === 1 ? 0 : 1;
  return value === 0 ? 0 : value === 1 ? 1 : 2;
};

const LITERAL = /\{\s*'([^']*)'\s*\}/g;

export function formatMessage(template: string, params: MessageParams = {}): string {
  const forms = template.split('|').map((form) => form.trim());
  const count = params['count'];
  const chosen =
    forms.length > 1
      ? (forms[typeof count === 'number' ? Math.min(pluralIndex(count, forms.length), forms.length - 1) : 0] ?? '')
      : template;

  return chosen
    .replace(/\{(\w+)\}/g, (match, name: string) => (Object.hasOwn(params, name) ? String(params[name]) : match))
    .replace(LITERAL, (_match, literal: string) => literal);
}
