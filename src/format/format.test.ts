import { describe, expect, it } from 'vitest';
import { formatMessage } from '../i18n/format';
import { matchLocale } from '../i18n/languages';
import {
  duotoneFor,
  formatCompactNumber,
  formatDuration,
  formatLongDuration,
  formatPartialDate,
  formatRatingValue,
  initials,
  relativeTime,
  yearOf,
} from './index';

describe('format', () => {
  it('formats durations like a player', () => {
    expect(formatDuration(383_493)).toBe('6:23');
    expect(formatDuration(3_725_000)).toBe('1:02:05');
    expect(formatLongDuration(3_216_000, 'pt-BR')).toMatch(/54/);
  });

  it('formats ratings and compact numbers per locale', () => {
    expect(formatRatingValue(4.5, 'pt-BR')).toBe('4,5');
    expect(formatRatingValue(4, 'en')).toBe('4');
    expect(formatCompactNumber(1_284_000, 'en')).toBe('1.3M');
  });

  it('reads partial MusicBrainz dates', () => {
    expect(yearOf('1997-05-21')).toBe('1997');
    expect(yearOf(null)).toBeNull();
    expect(formatPartialDate('1997', 'pt-BR')).toBe('1997');
    expect(formatPartialDate('1997-05-21', 'en')).toMatch(/May 21, 1997/);
  });

  it('builds initials and stable duotones', () => {
    expect(initials('Ana Souza')).toBe('AS');
    expect(initials('  björk ')).toBe('B');
    expect(duotoneFor('ok-computer')).toBe(duotoneFor('ok-computer'));
  });

  it('describes relative time', () => {
    const now = Date.parse('2026-10-06T12:00:00Z');
    expect(relativeTime('2026-10-06T11:00:00Z', 'en', now)).toBe('1 hour ago');
    expect(relativeTime('2026-10-04T12:00:00Z', 'pt-BR', now)).toBe('anteontem');
  });
});

describe('messages', () => {
  it('chooses plural forms and keeps literals', () => {
    expect(formatMessage('{formatted} avaliação | {formatted} avaliações', { count: 1, formatted: '1' })).toBe('1 avaliação');
    expect(formatMessage('{formatted} avaliação | {formatted} avaliações', { count: 3, formatted: '3' })).toBe('3 avaliações');
    expect(formatMessage("Avaliação de {'@'}{author}", { author: 'ana' })).toBe('Avaliação de @ana');
  });

  it('matches the closest locale', () => {
    expect(matchLocale(['pt-PT'], ['en', 'es', 'pt-BR'])).toBe('pt-BR');
    expect(matchLocale(['fr'], ['en', 'pt-BR'])).toBeNull();
  });
});
