import { initHeluxContext } from './factory/init';
import type { HeluxApi, model, modelFactory } from './types/model';
export { initHeluxContext };
export * from "helux-types"

export type AllApi = HeluxApi & {
  model: typeof model;
  modelFactory: typeof modelFactory;
};
