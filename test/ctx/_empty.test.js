/** for copy */
/** @typedef {import('../../src/types-inner').IRefCtx} Ctx */
import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import '../testSetup';
import { run, useConcent, getState, register } from '../../src/index';
import { okeys } from '../../src/support/util';
import { getTestModels } from '../util';

const models = getTestModels();
run(models, { log: false });


describe('test ctx api ', () => {
  test('empty', () => {

  });
});
