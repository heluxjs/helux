import { atom, share, useAtom, useShared } from '../helux';
import { makeTest } from './id.make';

makeTest({ label: 'useAtom', atom, useAtom });

makeTest({ label: 'useShared', atom: share as any, useAtom: useShared as any });
