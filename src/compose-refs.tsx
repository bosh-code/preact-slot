import type { Ref } from 'preact';
import { useCallback } from 'preact/hooks';

type PossibleRef<T> = Ref<T> | undefined;

function composeRefs<T>(...refs: PossibleRef<T>[]): (node: T) => void {
  return (node: T) => {
    refs.forEach(ref => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref && 'current' in ref) {
        (ref as any).current = node;
      }
    });
  };
}

/**
 * Hook version of composeRefs
 */
function useComposedRefs<T>(...refs: PossibleRef<T>[]): (node: T) => void {
  return useCallback(composeRefs(...refs), refs);
}

export { composeRefs, useComposedRefs };
