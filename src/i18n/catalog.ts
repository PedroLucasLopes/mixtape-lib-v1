import en from './locales/en.json';
import es from './locales/es.json';
import ptBR from './locales/pt-BR.json';
import { formatMessage, type MessageParams } from './format';
import { matchLocale } from './languages';

type Messages = typeof ptBR;

type Leaves<Tree, Prefix extends string = ''> = {
  [Key in keyof Tree & string]: Tree[Key] extends string ? `${Prefix}${Key}` : Leaves<Tree[Key], `${Prefix}${Key}.`>;
}[keyof Tree & string];

export type MixtapeTextKey = Leaves<Messages>;

const FALLBACK = 'pt-BR';

const CATALOG: Readonly<Record<string, Messages>> = { 'pt-BR': ptBR, en, es };

const CODES: readonly string[] = Object.keys(CATALOG);

const resolved = new Map<string, string>();

const catalogLocale = (locale: string): string => {
  let code = resolved.get(locale);
  if (!code) {
    code = matchLocale([locale], CODES) ?? FALLBACK;
    resolved.set(locale, code);
  }
  return code;
};

const lookup = (messages: Messages, key: string): string | undefined => {
  let node: unknown = messages;
  for (const part of key.split('.')) {
    if (!node || typeof node !== 'object' || !Object.hasOwn(node, part)) return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === 'string' ? node : undefined;
};

export function translate(locale: string | null | undefined, key: MixtapeTextKey, params?: MessageParams): string {
  const messages = CATALOG[catalogLocale(locale || FALLBACK)] ?? ptBR;
  const template = lookup(messages, key) ?? lookup(ptBR, key) ?? key;
  return formatMessage(template, params);
}
