import { readdirSync } from 'node:fs';
import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import type { Component } from 'vue';
import { consoleMessages } from '../console';
import { FIXTURES } from '../fixtures';

const CONSUMER_ID = 'consumer-id';

const kebab = (name: string) =>
  name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();

const names = (folder: string) =>
  readdirSync(new URL(folder, import.meta.url))
    .filter((file) => file.endsWith('.vue'))
    .map((file) => file.slice(0, -'.vue'.length));

const load = async (name: string, module: Promise<{ default: Component }>) => ({ name, component: (await module).default });

const components = await Promise.all([
  ...names('../../src/components/').map((name) => load(name, import(`../../src/components/${name}.vue`))),
  ...names('../../src/feedback/').map((name) => load(name, import(`../../src/feedback/${name}.vue`))),
]);

const render = async (name: string, component: Component, attrs: Record<string, string> = {}) => {
  const fixture = FIXTURES[name] ?? {};
  mount(component, { props: fixture.props, slots: fixture.slots, attrs, attachTo: document.body });
  await flushPromises();
};

describe.each(components)('$name', ({ name, component }) => {
  const id = `mx-${kebab(name.replace(/^Mx/, ''))}`;

  it('has a fixture in tests/fixtures.ts', () => {
    expect(FIXTURES[name], `add ${name} to FIXTURES`).toBeDefined();
  });

  it(`renders data-testid="${id}" without warnings`, async () => {
    await render(name, component);
    expect(document.querySelector(`[data-testid="${id}"]`)).not.toBeNull();
    expect(consoleMessages).toEqual([]);
  });

  it('hands the data-testid it receives to its main element', async () => {
    await render(name, component, { 'data-testid': CONSUMER_ID });
    expect(document.querySelectorAll(`[data-testid="${CONSUMER_ID}"]`)).toHaveLength(1);
    expect(consoleMessages).toEqual([]);
  });
});
