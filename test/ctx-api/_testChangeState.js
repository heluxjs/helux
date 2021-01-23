/**
 * this file is prepared for setState、setModuleState、invoke、dispatch
 */

/** @typedef {import('../../src/types-inner').IRefCtx} Ctx */
/** @typedef {import('enzyme').ReactWrapper<any, Readonly<{}>} Wrap */
import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import '../testSetup';
import { useConcent, getState, register } from '../../src/index';
import { delay } from '../../src/support/util';
import { getWrapNum, getWrapText } from '../util';

function makeTestComp(makeClickHandler) {
  const Book = React.memo((props) => {
    const { id } = props;
    const ctx = useConcent({ module: 'test', props }, 'Book');
    const { moduleComputed, renderCount } = ctx;
    const book = moduleComputed.bookMap[id];
    return (
      <div className={`book${id}`}>
        <h5 className={`renderCount${id}`}>{renderCount}</h5>
        <h5 className={`name${id}`}>{book.name}</h5>
        <h5 className={`author${id}`}>{book.author}</h5>
        <h5 className={`publishTime${id}`}>{book.publishTime}</h5>
        <button className={`book${id}`} onClick={makeClickHandler(ctx)}>click book</button>
      </div>
    );
  });
  const View = ({ ctx, handleClick }) => {
    const { renderCount, state } = ctx;
    return (
      <div>
        <h1>{renderCount}</h1>
        <h2>{state.name}</h2>
        <h3>{state.age}</h3>
        <h4 className="asValue">{state.asValue}</h4>
        <h4 className="grade">{state.grade}</h4>
        <h4 className="grade2">{state.grade2}</h4>
        <h4 className="isBig">{state.isBig + ''}</h4>
        <h4 className="isBig2">{state.isBig2 + ''}</h4>
        <h4 className="isBig3">{state.isBig3}</h4>
        <h4 className="nest_isBig">{state.nest.isBig + ''}</h4>
        <h4 className="nestArr_0">{state.nestArr[0] + ''}</h4>
        <h4 className="nestArr_1">{state.nestArr[1] + ''}</h4>
        <h4 className="nestObjArr_0_isBig">{state.nestObjArr[0].isBig + ''}</h4>
        <button className="comp" onClick={handleClick}>click me</button>
        {state.books.map(item => <Book key={item.id} id={item.id} />)}
      </div>
    );
  };

  const CompFn = () => {
    const ctx = useConcent({ module: 'test', renderKeyClasses: '*' }, 'BookFnBox');
    return <View handleClick={makeClickHandler(ctx)} ctx={ctx} />;
  };
  const CompCls = register({ module: 'test', renderKeyClasses: '*' }, 'BookClsBox')(
    class extends React.Component {
      render() {
        const ctx = this.ctx;
        return <View handleClick={makeClickHandler(ctx)} ctx={ctx} />;
      }
    }
  );

  return { CompFn, CompCls };
}

function mountThenClickForStAndCb(CompFn, CompCls) {
  const compFnWrap = mount(<CompFn />);
  const compFnH1Wrap = compFnWrap.find('h1');
  const compFnH2Wrap = compFnWrap.find('h3');
  const compFnBtnWrap = compFnWrap.find('button.comp');

  const compFnRenderCount = parseInt(compFnH1Wrap.text(), 10);
  const compFnAge = parseInt(compFnH2Wrap.text(), 10);

  const compClsWrap = mount(<CompCls />);
  const compClsH1Wrap = compClsWrap.find('h1');
  const compClsH2Wrap = compClsWrap.find('h3');
  const compClsBtnWrap = compClsWrap.find('button.comp');

  const compClsRenderCount = parseInt(compClsH1Wrap.text(), 10);
  const compClsAge = parseInt(compClsH2Wrap.text(), 10);

  act(() => {
    compFnBtnWrap.simulate('click');
    compClsBtnWrap.simulate('click');
  });

  const compFnRenderCountAfterClick = parseInt(compFnH1Wrap.text());
  const compClsRenderCountAfterClick = parseInt(compClsH1Wrap.text());
  const compFnAgeAfterClick = parseInt(compFnH2Wrap.text(), 10);
  const compClsAgeAfterClick = parseInt(compClsH2Wrap.text(), 10);

  return {
    compFnRenderCount, compClsRenderCount,
    compFnRenderCountAfterClick, compClsRenderCountAfterClick,
    compFnAge, compClsAge, compFnAgeAfterClick, compClsAgeAfterClick,
  };
};


const mountThenClick = async (Comps, options = {}) => {
  const compWrapList = [];
  Comps.forEach(Comp => compWrapList.push(mount(<Comp />)));

  let beforeClickRet = {};
  options.beforeClick && (beforeClickRet = options.beforeClick(compWrapList));
  options.executeClick && options.executeClick(compWrapList);
  if (options.afterClick) {
    await options.afterClick(compWrapList, beforeClickRet);
  }
};


export function testPassEmptyState(makeChangeStateHandler){
  const { CompFn, CompCls } = makeTestComp((/** @type Ctx*/ctx) => {
    const handler = makeChangeStateHandler(ctx);
    return handler;
  });
  const {
    compFnRenderCount, compClsRenderCount,
    compFnRenderCountAfterClick, compClsRenderCountAfterClick,
  } = mountThenClickForStAndCb(CompFn, CompCls);

  expect(compFnRenderCount).toBe(compFnRenderCountAfterClick);
  expect(compClsRenderCount).toBe(compClsRenderCountAfterClick);
}


export function testPassInvalidState(makeChangeStateHandler){
  const { CompFn, CompCls } = makeTestComp((/** @type Ctx*/ctx) => {
    const handler = makeChangeStateHandler(ctx);
    return handler;
  });
  const {
    compFnRenderCount, compClsRenderCount,
    compFnRenderCountAfterClick, compClsRenderCountAfterClick,
  } = mountThenClickForStAndCb(CompFn, CompCls);

  expect(compFnRenderCountAfterClick - compFnRenderCount).toBe(1);
  expect(compClsRenderCountAfterClick - compClsRenderCount).toBe(1);
}


export function testPassInvalidStateAndCb(makeChangeStateHandler){
  const { CompFn, CompCls } = makeTestComp((/** @type Ctx*/ctx) => {
    const handler = makeChangeStateHandler(ctx);
    return handler;
  });

  const age = getState('test').age;
  const {
    compFnAge, compClsAge, compFnAgeAfterClick, compClsAgeAfterClick,
  } = mountThenClickForStAndCb(CompFn, CompCls);
  expect(compFnAge).toBe(age);
  expect(compClsAge).toBe(age);
  expect(compFnAgeAfterClick).toBe(22);
  expect(compClsAgeAfterClick).toBe(22);
}

/**
 * renderKey and delay should work for item click
 */
export async function testDelayForItemClick(makeChangeStateHandler) {
  const makeClickHandler = (/** @type Ctx*/ctx) => () => {
    // change book 1 data
    const books = ctx.state.books;
    const bookId = 1;
    const book = books.find(v => v.id === bookId);
    book.author = 'monster';
    const changeState = makeChangeStateHandler(ctx, { books }, bookId);
    changeState();
  };

  const beforeClick = (/** @type Wrap[]*/[wrap1, wrap2, wrap3, wrap4]) => {
    // console.log(wrap1.find('.book1').debug());
    const wrap1Book1RenderCount = getWrapNum(wrap1, '.renderCount1');
    const wrap2Book1RenderCount = getWrapNum(wrap2, '.renderCount1');
    const wrap3Book1RenderCount = getWrapNum(wrap3, '.renderCount1');
    const wrap4Book1RenderCount = getWrapNum(wrap4, '.renderCount1');
    return { wrap1Book1RenderCount, wrap2Book1RenderCount, wrap3Book1RenderCount, wrap4Book1RenderCount };
  };
  const executeClick = (/** @type Wrap[]*/[wrap1]) => {
    // only pick one ins to click
    wrap1.find('button.book1').simulate('click');
  };
  const afterClick = async (/** @type Wrap[]*/wrapList, beforeClickRet) => {
    const [wrap1, wrap2, wrap3, wrap4] = wrapList;
    const {
      wrap1Book1RenderCount, wrap2Book1RenderCount, wrap3Book1RenderCount, wrap4Book1RenderCount,
    } = beforeClickRet;

    const wrap1Book1RenderCountClk = getWrapNum(wrap1, '.renderCount1');
    let wrap2Book1RenderCountClk = getWrapNum(wrap2, '.renderCount1');
    let wrap3Book1RenderCountClk = getWrapNum(wrap3, '.renderCount1');
    let wrap4Book1RenderCountClk = getWrapNum(wrap4, '.renderCount1');
    expect(wrap1Book1RenderCount + 1).toBe(wrap1Book1RenderCountClk);
    // these books are not updated because of delaying 500 in setState
    expect(wrap2Book1RenderCount).toBe(wrap2Book1RenderCountClk);
    expect(wrap3Book1RenderCount).toBe(wrap3Book1RenderCountClk);
    expect(wrap4Book1RenderCount).toBe(wrap4Book1RenderCountClk);

    await delay(1000);

    // read renderCount again, now theay should added by 1
    wrap2Book1RenderCountClk = getWrapNum(wrap2, '.renderCount1');
    wrap3Book1RenderCountClk = getWrapNum(wrap3, '.renderCount1');
    wrap4Book1RenderCountClk = getWrapNum(wrap4, '.renderCount1');
    expect(wrap2Book1RenderCount + 1).toBe(wrap2Book1RenderCountClk);
    expect(wrap3Book1RenderCount + 1).toBe(wrap3Book1RenderCountClk);
    expect(wrap4Book1RenderCount + 1).toBe(wrap4Book1RenderCountClk);
    // console.log('execute to end');
    wrapList.forEach(wrap => wrap.unmount());
  };

  const { CompFn, CompCls } = makeTestComp(makeClickHandler);
  const CompList = [CompFn, CompCls, CompFn, CompCls];
  await mountThenClick(CompList, { beforeClick, executeClick, afterClick });
}


export async function testRenderKey(makeChangeStateHandler){
  const makeClickHandler = (/** @type Ctx*/ctx) => () => {
    // change book 1 data
    const books = ctx.state.books;
    const bookId = 1;
    const book = books.find(v => v.id === bookId);
    book.author = 'epc';
    const changeState = makeChangeStateHandler(ctx, { books }, bookId);
    changeState();
  };
  const beforeClick = (/** @type Wrap[]*/[compFnWrap, compClsWrap]) => {
    const compFnBook1RenderCount = getWrapNum(compFnWrap, '.renderCount1');
    const compClsBook1RenderCount = getWrapNum(compClsWrap, '.renderCount1');
    const compFnBook2RenderCount = getWrapNum(compFnWrap, '.renderCount2');
    const compClsBook2RenderCount = getWrapNum(compClsWrap, '.renderCount2');
    return { compFnBook1RenderCount, compClsBook1RenderCount, compFnBook2RenderCount, compClsBook2RenderCount };
  };
  const executeClick = (/** @type Wrap[]*/[compFnWrap, compClsWrap]) => {
    act(() => {
      compFnWrap.find('button.comp').simulate('click');
      compClsWrap.find('button.comp').simulate('click');
    });
  };
  const afterClick = (/** @type Wrap[]*/[compFnWrap, compClsWrap], beforeClickRet) => {
    const {
      compFnBook1RenderCount, compClsBook1RenderCount, compFnBook2RenderCount, compClsBook2RenderCount,
    } = beforeClickRet;
    // renderCount after clicked
    const compFnBook1RenderCountCLK = getWrapNum(compFnWrap, '.renderCount1');
    const compClsBook1RenderCountCLK = getWrapNum(compClsWrap, '.renderCount1');
    const compFnBook2RenderCountCLK = getWrapNum(compFnWrap, '.renderCount2');
    const compClsBook2RenderCountCLK = getWrapNum(compClsWrap, '.renderCount2');

    // book 1 should updated
    expect(compFnBook1RenderCount + 1).toBe(compFnBook1RenderCountCLK);
    expect(compClsBook1RenderCount + 1).toBe(compClsBook1RenderCountCLK);
    // book 2 should not updated
    expect(compFnBook2RenderCountCLK).toBe(compFnBook2RenderCount);
    expect(compClsBook2RenderCountCLK).toBe(compClsBook2RenderCount);
  };

  const { CompFn, CompCls } = makeTestComp(makeClickHandler);
  await mountThenClick([CompFn, CompCls], { beforeClick, executeClick, afterClick });
}


export async function testRenderKeyForContainerClick(makeChangeStateHandler) {
  const makeClickHandler = (/** @type Ctx*/ctx) => () => {
    // change book 1 data
    const books = ctx.state.books;
    const bookId = 1;
    const book = books.find(v => v.id === bookId);
    book.author = 'monster';
    const changeState = makeChangeStateHandler(ctx, { books }, bookId);
    changeState();
  };

  const beforeClick = (/** @type Wrap[]*/[wrap1, wrap2, wrap3, wrap4]) => {
    // console.log(wrap1.find('.book1').debug());
    const wrap1Book1RenderCount = getWrapNum(wrap1, '.renderCount1');
    const wrap2Book1RenderCount = getWrapNum(wrap2, '.renderCount1');
    const wrap3Book1RenderCount = getWrapNum(wrap3, '.renderCount1');
    const wrap4Book1RenderCount = getWrapNum(wrap4, '.renderCount1');
    const wrap1Book2RenderCount = getWrapNum(wrap1, '.renderCount2');
    const wrap2Book2RenderCount = getWrapNum(wrap2, '.renderCount2');
    const wrap3Book2RenderCount = getWrapNum(wrap3, '.renderCount2');
    const wrap4Book2RenderCount = getWrapNum(wrap4, '.renderCount2');
    return {
      wrap1Book1RenderCount, wrap2Book1RenderCount, wrap3Book1RenderCount, wrap4Book1RenderCount,
      wrap1Book2RenderCount, wrap2Book2RenderCount, wrap3Book2RenderCount, wrap4Book2RenderCount,
    };
  };
  const executeClick = (/** @type Wrap[]*/[wrap1]) => {
    // only pick one ins to click
      wrap1.find('button.comp').simulate('click');
  };
  const afterClick = async (/** @type Wrap[]*/wrapList, beforeClickRet) => {
    const [wrap1, wrap2, wrap3, wrap4] = wrapList;
    const {
      wrap1Book1RenderCount, wrap2Book1RenderCount, wrap3Book1RenderCount, wrap4Book1RenderCount,
      wrap1Book2RenderCount, wrap2Book2RenderCount, wrap3Book2RenderCount, wrap4Book2RenderCount,
    } = beforeClickRet;

    const wrap1Book1RenderCountClk = getWrapNum(wrap1, '.renderCount1');
    const wrap2Book1RenderCountClk = getWrapNum(wrap2, '.renderCount1');
    const wrap3Book1RenderCountClk = getWrapNum(wrap3, '.renderCount1');
    const wrap4Book1RenderCountClk = getWrapNum(wrap4, '.renderCount1');
    const wrap1Book2RenderCountClk = getWrapNum(wrap1, '.renderCount2');
    const wrap2Book2RenderCountClk = getWrapNum(wrap2, '.renderCount2');
    const wrap3Book2RenderCountClk = getWrapNum(wrap3, '.renderCount2');
    const wrap4Book2RenderCountClk = getWrapNum(wrap4, '.renderCount2');

    // all book1 ins updated
    expect(wrap1Book1RenderCount + 1).toBe(wrap1Book1RenderCountClk);
    expect(wrap2Book1RenderCount + 1).toBe(wrap2Book1RenderCountClk);
    expect(wrap3Book1RenderCount + 1).toBe(wrap3Book1RenderCountClk);
    expect(wrap4Book1RenderCount + 1).toBe(wrap4Book1RenderCountClk);

    // all book2 ins do not update
    expect(wrap1Book2RenderCount).toBe(wrap1Book2RenderCountClk);
    expect(wrap2Book2RenderCount).toBe(wrap2Book2RenderCountClk);
    expect(wrap3Book2RenderCount).toBe(wrap3Book2RenderCountClk);
    expect(wrap4Book2RenderCount).toBe(wrap4Book2RenderCountClk);
    // console.log('execute to end');
    wrapList.forEach(wrap => wrap.unmount());
  };

  const { CompFn, CompCls } = makeTestComp(makeClickHandler);
  const CompList = [CompFn, CompCls, CompFn, CompCls];
  await mountThenClick(CompList, { beforeClick, executeClick, afterClick });
}

// for sync api
export async function testSyncApi(makeChangeStateHandler, syncKeySelector, custCompare) {
  const makeClickHandler = (/** @type Ctx*/ctx) => () => {
    const changeState = makeChangeStateHandler(ctx);
    changeState();
  };

  const beforeClick = (/** @type Wrap[]*/[wrap1, wrap2]) => {
    const wrap1IsBig = getWrapText(wrap1, syncKeySelector);
    const wrap2IsBig = getWrapText(wrap2, syncKeySelector);
    return {
      wrap1IsBig, wrap2IsBig,
    };
  };

  const executeClick = (/** @type Wrap[]*/[wrap1]) => {
    // only pick one ins to click
    wrap1.find('button.comp').simulate('click');
  };
  const afterClick = async (/** @type Wrap[]*/wrapList, beforeClickRet) => {
    const [wrap1, wrap2] = wrapList;
    const { wrap1IsBig, wrap2IsBig } = beforeClickRet;

    const wrap1IsBigClk = getWrapText(wrap1, syncKeySelector);
    const wrap2IsBigClk = getWrapText(wrap2, syncKeySelector);
    expect(wrap1IsBig === wrap1IsBigClk).toBeFalsy();
    expect(wrap2IsBig === wrap2IsBigClk).toBeFalsy();

    if (custCompare) {
      custCompare()
    }
  };

  const { CompFn, CompCls } = makeTestComp(makeClickHandler);
  const CompList = [CompFn, CompCls];
  await mountThenClick(CompList, { beforeClick, executeClick, afterClick });
}
