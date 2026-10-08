import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import MxConfirmDialog from '../../src/components/MxConfirmDialog.vue';
import MxDialog from '../../src/components/MxDialog.vue';
import MxErrorState from '../../src/components/MxErrorState.vue';
import MxLoadMore from '../../src/components/MxLoadMore.vue';
import MxToastHost from '../../src/feedback/MxToastHost.vue';
import { dismissToast, toast, useToasts } from '../../src/feedback/useToast';
import { attached, getByTestId, queryByTestId } from '../dom';

afterEach(() => {
  for (const item of [...useToasts().toasts.value]) dismissToast(item.id);
  vi.useRealTimers();
});

describe('MxDialog', () => {
  it('shows its title and closes from the button', async () => {
    const wrapper = mount(MxDialog, { props: { modelValue: true, title: 'Compartilhar' }, slots: { default: '<p>Corpo</p>' }, ...attached });
    await flushPromises();
    expect(getByTestId('mx-dialog-title').text()).toBe('Compartilhar');
    expect(getByTestId('mx-dialog-body').text()).toBe('Corpo');
    await getByTestId('mx-dialog-close').trigger('click');
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]]);
  });

  it('has no close button when persistent', async () => {
    mount(MxDialog, { props: { modelValue: true, title: 'Salvando', persistent: true }, ...attached });
    await flushPromises();
    expect(queryByTestId('mx-dialog-close')).toBeNull();
  });
});

describe('MxConfirmDialog', () => {
  it('confirms or closes', async () => {
    const wrapper = mount(MxConfirmDialog, { props: { modelValue: true, title: 'Apagar avaliação?', message: 'Não tem volta.' }, ...attached });
    await flushPromises();
    expect(getByTestId('mx-confirm-dialog-message').text()).toBe('Não tem volta.');
    await getByTestId('mx-confirm-dialog-confirm').trigger('click');
    expect(wrapper.emitted('confirm')).toHaveLength(1);
    await getByTestId('mx-confirm-dialog-cancel').trigger('click');
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]]);
  });

  it('shows the failure inside the dialog and locks it while working', async () => {
    mount(MxConfirmDialog, {
      props: { modelValue: true, title: 'Apagar avaliação?', message: 'Não tem volta.', error: 'Não deu para apagar agora.', loading: true },
      ...attached,
    });
    await flushPromises();
    expect(getByTestId('mx-confirm-dialog-error').text()).toContain('Não deu para apagar agora.');
    expect(getByTestId('mx-confirm-dialog-error').attributes('role')).toBe('alert');
    expect(getByTestId('mx-confirm-dialog-cancel').attributes('disabled')).toBeDefined();
    expect(queryByTestId('mx-dialog-close')).toBeNull();
  });
});

describe('MxToastHost', () => {
  it('shows notices politely and lets them go after a while', async () => {
    vi.useFakeTimers();
    mount(MxToastHost, attached);
    toast.success('Avaliação salva.');
    await nextTick();
    expect(getByTestId('mx-toast-host-success').text()).toContain('Avaliação salva.');
    expect(getByTestId('mx-toast-host-success').element.closest('[role="status"]')).not.toBeNull();
    await vi.advanceTimersByTimeAsync(4500);
    expect(queryByTestId('mx-toast-host-success')).toBeNull();
  });

  it('keeps errors until they are dismissed', async () => {
    vi.useFakeTimers();
    mount(MxToastHost, attached);
    toast.error('Não foi possível salvar.');
    await nextTick();
    await vi.advanceTimersByTimeAsync(30_000);
    expect(getByTestId('mx-toast-host-error').element.closest('[role="alert"]')).not.toBeNull();
    await getByTestId('mx-toast-host-close').trigger('click');
    expect(queryByTestId('mx-toast-host-error')).toBeNull();
  });

  it('runs the action and closes the notice', async () => {
    const handler = vi.fn();
    mount(MxToastHost, attached);
    toast.info('Avaliação apagada.', { action: { label: 'Desfazer', handler } });
    await nextTick();
    await getByTestId('mx-toast-host-action').trigger('click');
    expect(handler).toHaveBeenCalledOnce();
    expect(queryByTestId('mx-toast-host-info')).toBeNull();
  });
});

describe('MxErrorState', () => {
  it('asks to try again', async () => {
    const wrapper = mount(MxErrorState, attached);
    expect(getByTestId('mx-error-state').attributes('role')).toBe('alert');
    await getByTestId('mx-error-state-retry').trigger('click');
    expect(wrapper.emitted('retry')).toHaveLength(1);
  });
});

describe('MxLoadMore', () => {
  it('loads the next page on request and says when there is no more', async () => {
    const wrapper = mount(MxLoadMore, { props: { hasMore: true, auto: false }, ...attached });
    await getByTestId('mx-load-more-button').trigger('click');
    expect(wrapper.emitted('load')).toHaveLength(1);
    await wrapper.setProps({ hasMore: false });
    expect(queryByTestId('mx-load-more-button')).toBeNull();
    expect(getByTestId('mx-load-more-done').exists()).toBe(true);
  });

  it('does not ask twice while loading', async () => {
    const wrapper = mount(MxLoadMore, { props: { hasMore: true, auto: false, loading: true }, ...attached });
    await getByTestId('mx-load-more-button').trigger('click');
    expect(wrapper.emitted('load')).toBeUndefined();
  });
});
