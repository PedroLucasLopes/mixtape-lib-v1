import { DOMWrapper } from '@vue/test-utils';

export const byTestId = (id: string): string => `[data-testid="${id}"]`;

export function getByTestId(id: string): DOMWrapper<HTMLElement> {
  const element = document.querySelector<HTMLElement>(byTestId(id));
  if (!element) throw new Error(`No element with data-testid="${id}" in the document.`);
  return new DOMWrapper(element);
}

export function queryByTestId(id: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(byTestId(id));
}

export function allByTestId(id: string): DOMWrapper<HTMLElement>[] {
  return [...document.querySelectorAll<HTMLElement>(byTestId(id))].map((element) => new DOMWrapper(element));
}

export const attached = { attachTo: document.body } as const;
