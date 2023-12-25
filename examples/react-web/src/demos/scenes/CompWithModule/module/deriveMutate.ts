import { Draft, MutateFnItem } from './mutateState';
import { ctx } from './state';

export function plusAByB(draft: Draft) {
  draft.a = draft.b + 1;
}

export function changeC(draft: Draft) {
  console.error('c is watching j', ctx.state.val.j + 1);
  draft.c = ctx.state.val.j + 1;
}

/**
 * MutateFnItemType<[number]> 约束了 deps 返回类型和 task 里的 input 类型
 */
export const changeDTask: MutateFnItem<[number]> = {
  deps: () => [ctx.state.val.j],
  task: async ({ draft, input }) => {
    draft.d = input[0] + 1;
  },
}
