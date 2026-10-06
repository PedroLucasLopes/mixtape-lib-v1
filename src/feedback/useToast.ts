import { readonly, ref } from 'vue';

export type ToastKind = 'success' | 'error' | 'info' | 'warning';

export interface ToastAction {
  label: string;
  handler: () => void;
}

export interface ToastOptions {
  kind?: ToastKind;
  duration?: number | null;
  action?: ToastAction;
  icon?: string;
}

export interface Toast {
  id: number;
  message: string;
  kind: ToastKind;
  duration: number | null;
  action?: ToastAction;
  icon?: string;
}

const DEFAULT_DURATION = 4500;
const MAX_VISIBLE = 4;

const items = ref<Toast[]>([]);
let sequence = 0;

export function dismissToast(id: number): void {
  items.value = items.value.filter((item) => item.id !== id);
}

function push(message: string, options: ToastOptions = {}): number {
  const kind = options.kind ?? 'info';
  const id = ++sequence;
  const duration = options.duration !== undefined ? options.duration : kind === 'error' ? null : DEFAULT_DURATION;
  const next: Toast = { id, message, kind, duration, action: options.action, icon: options.icon };
  items.value = [...items.value, next].slice(-MAX_VISIBLE);
  return id;
}

export const toast = Object.assign(push, {
  success: (message: string, options: Omit<ToastOptions, 'kind'> = {}) => push(message, { ...options, kind: 'success' }),
  error: (message: string, options: Omit<ToastOptions, 'kind'> = {}) => push(message, { ...options, kind: 'error' }),
  info: (message: string, options: Omit<ToastOptions, 'kind'> = {}) => push(message, { ...options, kind: 'info' }),
  warning: (message: string, options: Omit<ToastOptions, 'kind'> = {}) => push(message, { ...options, kind: 'warning' }),
});

export function useToasts() {
  return { toasts: readonly(items), dismiss: dismissToast };
}
