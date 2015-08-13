'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _lodashIsequal = require('lodash.isequal');

var _lodashIsequal2 = _interopRequireDefault(_lodashIsequal);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _utilsTinyMCEUtils = require('../utils/tinyMCEUtils');

var _utilsLast = require('../utils/last');

var _utilsLast2 = _interopRequireDefault(_utilsLast);

var _utilsUid = require('../utils/uid');

var _utilsUid2 = _interopRequireDefault(_utilsUid);

var _utilsRenderComponent = require('../utils/renderComponent');

var _utilsRenderComponent2 = _interopRequireDefault(_utilsRenderComponent);

var _componentsEditorMention = require('../components/EditorMention');

var _componentsEditorMention2 = _interopRequireDefault(_componentsEditorMention);

var TinyMCEDelegate = (function (_Component) {
  _inherits(TinyMCEDelegate, _Component);

  function TinyMCEDelegate() {
    _classCallCheck(this, _TinyMCEDelegate);

    _get(Object.getPrototypeOf(_TinyMCEDelegate.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(TinyMCEDelegate, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      var nextEditorId = nextProps.editor && nextProps.editor.id;
      var editorId = this.props.editor && this.props.editor.id;

      return nextEditorId !== editorId || !(0, _lodashIsequal2['default'])(nextProps.mentions, this.props.mentions);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var currLength = this.props.mentions.length;
      var nextLength = nextProps.mentions.length;

      this.setState({
        shouldRender: currLength <= nextLength
      });
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      var shouldRender = this.state.shouldRender;
      var _props = this.props;
      var editor = _props.editor;
      var mentions = _props.mentions;

      var mentionsValid = mentions && mentions.length;

      if (editor && mentionsValid && shouldRender) {
        this._clearUnfinishedMention();
        this._renderMentionIntoEditor();
      }
    }

    /**
     * Remove last, incomplete mention before autocomplete (@carl_be...)
     * and sets cursor at the end in order to replace with proper Mention
     * component.
     */
  }, {
    key: '_clearUnfinishedMention',
    value: function _clearUnfinishedMention() {
      var editor = this.props.editor;

      var _findMentions = (0, _utilsTinyMCEUtils.findMentions)(editor);

      var lastMention = _findMentions.lastMention;
      var startPos = lastMention.startPos;

      // First remove the mention
      editor.setContent((0, _utilsTinyMCEUtils.removeMention)(editor, startPos));
      editor.selection.select(editor.getBody(), true);
      editor.selection.collapse(false);

      // The clean the body if we're at the beginning; tinMCE weirdly
      // inserts invalid markup.
      var text = editor.getBody();
      var tinymceWeirdMatch = '<p>&nbsp;<br></p>';

      if (text.innerHTML === tinymceWeirdMatch) {
        editor.setContent('');
      }
    }
  }, {
    key: '_renderMentionIntoEditor',
    value: function _renderMentionIntoEditor() {
      var _props2 = this.props;
      var editor = _props2.editor;
      var mentions = _props2.mentions;
      var onAdd = _props2.onAdd;

      var mention = (0, _utilsLast2['default'])(mentions);
      var label = mention.label;
      var id = mention.id;

      var text = editor.getBody().innerText;
      var insertLeadingSpace = text.trim().length !== 0;
      var spaceUid = (0, _utilsUid2['default'])('space-');

      var markup = (0, _utilsRenderComponent2['default'])(_react2['default'].createElement(_componentsEditorMention2['default'], {
        label: label,
        id: id
      }));

      var formattedMarkup = insertLeadingSpace ? ' ' + markup : '' + markup;

      // Insert new link and exit styling via
      editor.execCommand('mceInsertRawHTML', false, formattedMarkup + '<span id="' + spaceUid + '"> ‌</span>');

      (0, _utilsTinyMCEUtils.exitSelection)(editor);

      if (onAdd) {
        onAdd(mention);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return null;
    }
  }], [{
    key: 'propTypes',
    value: {
      editor: _react.PropTypes.object,
      mentions: _react.PropTypes.array,
      onAdd: _react.PropTypes.func
    },
    enumerable: true
  }]);

  var _TinyMCEDelegate = TinyMCEDelegate;
  TinyMCEDelegate = (0, _reactRedux.connect)(function (state) {
    return {
      editor: state.mention.editor,
      mentions: state.mention.mentions
    };
  })(TinyMCEDelegate) || TinyMCEDelegate;
  return TinyMCEDelegate;
})(_react.Component);

exports['default'] = TinyMCEDelegate;
module.exports = exports['default'];