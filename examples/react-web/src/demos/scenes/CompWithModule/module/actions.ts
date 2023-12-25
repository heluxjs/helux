import { ActionTaskParams } from './state';

export function changeA(params: ActionTaskParams<number>) {
  return 2;
}

export function changeF(params: ActionTaskParams<number>) {
  // TODO fix me
  console.log('call changeF');
  // params.draftRoot.val.f += 100;
  params.draft.f += 100;
}

export function changeG(params: ActionTaskParams<number>) {
  params.draft.g += 2;
}
