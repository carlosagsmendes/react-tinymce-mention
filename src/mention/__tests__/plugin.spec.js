import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { initializePlugin } from '../plugin';
import mentionReducer from '../reducers/mentionReducer';
import dataSourceStatic from '../reducers/__tests__/fixtures/dataSourceStatic';
import initializeEditor from './fixtures/initializeEditor';
import { query, resetQuery, select, finalizeSetup } from '../actions/mentionActions';
import { removeMention } from '../utils/tinyMCEUtils';
import { testExports } from '../plugin';

const {
  _performIntermediateActions,
  _isNearMention,
  _removeMentionFromEditor,
  _handleKeyPress,
  _handleEditorBackspace,
} = testExports;

describe('TinyMCE Plugin', () => {
  var store, tinymce, editor;

  const getState = () => store.getState();

  beforeEach((done) => {
    const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

    store = createStoreWithMiddleware(mentionReducer, {
      dataSource: dataSourceStatic,
      highlightIndex: 0,
      mentions: [],
      query: ''
    });

    tinymce = initializeEditor();
    initializePlugin(store, dataSourceStatic, '@');

    setTimeout(() => {
      editor = tinymce.activeEditor;
      done();
    }, 10);
  });

  afterEach(() => {
    store = null;
    editor = null;
  });

  it('should be tested', () => {
    expect(getState().dataSource[0]).toEqual('alex gray');
  });

  it('should be near mention', () => {
    const str = 'Hello there @jim and @john';
    expect(_isNearMention(str).toString()).toEqual('@john');
  })
});
