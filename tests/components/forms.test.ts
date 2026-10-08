import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import MxBalloonPicker from '../../src/components/MxBalloonPicker.vue';
import MxPasswordField from '../../src/components/MxPasswordField.vue';
import MxRatingInput from '../../src/components/MxRatingInput.vue';
import MxSearchField from '../../src/components/MxSearchField.vue';
import MxSegmented from '../../src/components/MxSegmented.vue';
import MxStepper from '../../src/components/MxStepper.vue';
import { allByTestId, attached, getByTestId, queryByTestId } from '../dom';
import { genres, ranges, steps } from '../fixtures';

describe('MxRatingInput', () => {
  it('moves half a disc with the arrows and jumps with Home and End', async () => {
    const wrapper = mount(MxRatingInput, { props: { modelValue: 2 }, ...attached });
    const slider = getByTestId('mx-rating-input-slider');
    expect(slider.attributes('aria-valuenow')).toBe('2');
    await slider.trigger('keydown', { key: 'ArrowRight' });
    await slider.trigger('keydown', { key: 'End' });
    await slider.trigger('keydown', { key: 'Home' });
    expect(wrapper.emitted('update:modelValue')).toEqual([[2.5], [5], [0]]);
    expect(wrapper.emitted('commit')).toEqual([[2.5], [5], [0]]);
  });

  it('takes zero as a real rating', async () => {
    const wrapper = mount(MxRatingInput, {
      props: { modelValue: null, 'onUpdate:modelValue': (value: number | null) => wrapper.setProps({ modelValue: value }) },
      ...attached,
    });
    await getByTestId('mx-rating-input-zero').trigger('click');
    expect(wrapper.emitted('commit')).toEqual([[0]]);
    expect(getByTestId('mx-rating-input-zero').attributes('aria-pressed')).toBe('true');
    expect(getByTestId('mx-rating-input-slider').attributes('aria-valuenow')).toBe('0');
  });

  it('ignores input when disabled', async () => {
    const wrapper = mount(MxRatingInput, { props: { modelValue: 3, disabled: true }, ...attached });
    await getByTestId('mx-rating-input-slider').trigger('keydown', { key: 'ArrowRight' });
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    expect(getByTestId('mx-rating-input-zero').attributes('disabled')).toBeDefined();
  });
});

describe('MxSegmented', () => {
  it('selects by click and with the arrows', async () => {
    const wrapper = mount(MxSegmented, { props: { modelValue: 'week', options: ranges, label: 'Período' }, ...attached });
    expect(getByTestId('mx-segmented-option-week').attributes('aria-checked')).toBe('true');
    expect(getByTestId('mx-segmented-option-month').attributes('aria-checked')).toBe('false');
    await getByTestId('mx-segmented-option-year').trigger('click');
    await getByTestId('mx-segmented-option-week').trigger('keydown', { key: 'ArrowRight' });
    await getByTestId('mx-segmented-option-week').trigger('keydown', { key: 'End' });
    expect(wrapper.emitted('update:modelValue')).toEqual([['year'], ['month'], ['year']]);
  });
});

describe('MxStepper', () => {
  const slots = { account: '<p>Conta</p>', profile: '<p>Perfil</p>', styles: '<p>Estilos</p>' };

  it('only goes as far as the person has reached', async () => {
    const wrapper = mount(MxStepper, { props: { modelValue: 0, steps, label: 'Criar conta', reachable: 1 }, slots, ...attached });
    expect(getByTestId('mx-stepper-tab-styles').attributes('aria-disabled')).toBe('true');
    await getByTestId('mx-stepper-tab-styles').trigger('click');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    await getByTestId('mx-stepper-tab-profile').trigger('click');
    expect(wrapper.emitted('update:modelValue')).toEqual([[1]]);
  });

  it('moves with the keyboard inside the reachable steps', async () => {
    const wrapper = mount(MxStepper, { props: { modelValue: 0, steps, label: 'Criar conta', reachable: 1 }, slots, ...attached });
    await getByTestId('mx-stepper-tab-account').trigger('keydown', { key: 'End' });
    expect(wrapper.emitted('update:modelValue')).toEqual([[1]]);
  });

  it('shows the panel of the current step', () => {
    mount(MxStepper, { props: { modelValue: 1, steps, label: 'Criar conta', reachable: 1 }, slots, ...attached });
    expect(getByTestId('mx-stepper-panel').text()).toBe('Perfil');
    expect(getByTestId('mx-stepper-tab-profile').attributes('aria-selected')).toBe('true');
  });
});

describe('MxPasswordField', () => {
  it('shows and hides what was typed', async () => {
    mount(MxPasswordField, { props: { label: 'Senha', modelValue: 'disco-de-vinil-42' }, ...attached });
    expect(getByTestId('mx-password-field-input').find('input').attributes('type')).toBe('password');
    await getByTestId('mx-password-field-toggle').trigger('click');
    expect(getByTestId('mx-password-field-input').find('input').attributes('type')).toBe('text');
    expect(getByTestId('mx-password-field-toggle').attributes('aria-pressed')).toBe('true');
  });

  it('lists each rule with its state and measures strength only when asked', () => {
    const rules = [
      { key: 'length', label: 'Pelo menos 8 caracteres', passed: false },
      { key: 'letter', label: 'Uma letra', passed: true },
    ];
    mount(MxPasswordField, { props: { label: 'Senha', modelValue: 'abc', rules, showStrength: true }, ...attached });
    expect(getByTestId('mx-password-field-rule-length').classes()).not.toContain('mx-password__rule--passed');
    expect(getByTestId('mx-password-field-rule-letter').classes()).toContain('mx-password__rule--passed');
    expect(getByTestId('mx-password-field-strength').exists()).toBe(true);
  });
});

describe('MxSearchField', () => {
  it('sends the trimmed query and ignores blanks', async () => {
    const wrapper = mount(MxSearchField, { props: { modelValue: '  neon  ' }, ...attached });
    await getByTestId('mx-search-field').trigger('submit');
    expect(wrapper.emitted('submit')).toEqual([['neon']]);
    await wrapper.setProps({ modelValue: '   ' });
    await getByTestId('mx-search-field').trigger('submit');
    expect(wrapper.emitted('submit')).toHaveLength(1);
  });

  it('clears with the button', async () => {
    const wrapper = mount(MxSearchField, { props: { modelValue: 'neon' }, ...attached });
    await getByTestId('mx-search-field-clear').trigger('click');
    expect(wrapper.emitted('update:modelValue')).toEqual([['']]);
  });

  it('clears with Escape and hides the clear button when empty', async () => {
    const wrapper = mount(MxSearchField, { props: { modelValue: 'neon' }, ...attached });
    await getByTestId('mx-search-field-input').trigger('keydown', { key: 'Escape' });
    expect(wrapper.emitted('update:modelValue')).toEqual([['']]);
    await wrapper.setProps({ modelValue: '' });
    expect(queryByTestId('mx-search-field-clear')).toBeNull();
  });
});

describe('MxBalloonPicker', () => {
  const options = genres.slice(0, 3);

  it('picks a style with a click', async () => {
    const wrapper = mount(MxBalloonPicker, { props: { modelValue: [], options, label: 'Estilos' }, ...attached });
    await allByTestId('mx-balloon-picker-option')[0]!.trigger('click');
    expect(wrapper.emitted('update:modelValue')).toEqual([[[options[0]!.value]]]);
  });

  it('blocks new picks once the limit is reached', async () => {
    const wrapper = mount(MxBalloonPicker, { props: { modelValue: [options[0]!.value], options, label: 'Estilos', max: 1 }, ...attached });
    const balloons = allByTestId('mx-balloon-picker-option');
    expect(balloons[0]!.attributes('aria-pressed')).toBe('true');
    expect(balloons[1]!.attributes('aria-disabled')).toBe('true');
    await balloons[1]!.trigger('click');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    expect(getByTestId('mx-balloon-picker-status').text()).toBe('1 de 1 escolhido');
  });
});
