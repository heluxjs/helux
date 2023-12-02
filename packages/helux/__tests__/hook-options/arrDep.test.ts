import { atom, share, useAtom, useShared } from '../helux';
import { makeTest } from './_makeArrDepTest';

makeTest({ label: 'useAtom', atom, useAtom });

makeTest({ label: 'useShared', atom: share as any, useAtom: useShared as any });
