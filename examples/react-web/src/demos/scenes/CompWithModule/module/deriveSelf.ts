import { Draft, MutateFnItem, MutateFnParams } from './state';

/**
 * 对应 mutateFnItem.fn
 */
export function plusK(draft: Draft) {
  draft.k = draft.g + 1;
}

export function plusK2(draft: Draft, params: MutateFnParams) {
  draft.k = draft.g + 1;
}

/**
 * 对应 mutateFnItem.task
 */
export const jTask: MutateFnItem<[number]> = {
  deps: (state) => {
    console.error('trigger jTask deps');
    return [state.g];
  },
  task: async ({ draft, input }) => {
    console.error('trigger jTask task', input);
    draft.j = input[0] + 2;
  },
}
