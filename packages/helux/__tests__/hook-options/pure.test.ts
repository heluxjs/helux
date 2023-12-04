import { atom, share, useAtom, useShared } from '../helux';
import { makeTest } from './pure.make';

makeTest({ label: 'useAtom', pure: undefined, atom, useAtom });

makeTest({ label: 'useAtom', pure: true, atom, useAtom });

makeTest({ label: 'useAtom', pure: false, atom, useAtom });

makeTest({ label: 'useShared', pure: undefined, atom: share as any, useAtom: useShared as any });

makeTest({ label: 'useShared', pure: true, atom: share as any, useAtom: useShared as any });

makeTest({ label: 'useShared', pure: false, atom: share as any, useAtom: useShared as any });
