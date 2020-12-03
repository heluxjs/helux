/** for copy */
import React from 'react';
import { mount } from 'enzyme';
import '../testSetup';
import { run, useConcent, getState, register } from '../../src/index';
import { okeys } from '../../src/support/util';
import { getTestModels } from '../util';

const models = getTestModels();
run(models, { logError: false });


describe('test ctx api ', () => {
  test('empty', () => {

  });
});
