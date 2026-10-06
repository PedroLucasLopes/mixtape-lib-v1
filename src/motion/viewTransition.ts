import { prefersReducedMotion } from './reducedMotion';

interface ViewTransitionLike {
  finished: Promise<void>;
  updateCallbackDone: Promise<void>;
}

type DocumentWithTransitions = Document & {
  startViewTransition?: (update: () => Promise<void> | void) => ViewTransitionLike;
};

export function supportsViewTransitions(): boolean {
  return typeof document !== 'undefined' && typeof (document as DocumentWithTransitions).startViewTransition === 'function';
}

export function startViewTransition(update: () => Promise<void> | void): Promise<void> {
  const doc = typeof document === 'undefined' ? null : (document as DocumentWithTransitions);
  if (!doc?.startViewTransition || prefersReducedMotion()) {
    return Promise.resolve(update()).then(() => undefined);
  }
  return doc.startViewTransition(update).updateCallbackDone;
}

export function viewTransitionName(kind: string, id: string | null | undefined): string | undefined {
  if (!id) return undefined;
  return `mx-${kind}-${id.replace(/[^a-zA-Z0-9_-]/g, '')}`;
}
