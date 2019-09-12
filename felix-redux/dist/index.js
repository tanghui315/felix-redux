'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRedux = require('react-redux');

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

var _getStoreConfigure3 = require('./getStoreConfigure');

var _getStoreConfigure4 = _interopRequireDefault(_getStoreConfigure3);

var _ajax2 = require('rxjs/observable/dom/ajax');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _store = void 0;

function _isArray(something) {
  return Object.prototype.toString.call(something) === '[object Array]';
}

function _getStore() {
  return _store;
}

function _start(Root, domId) {
  var _getStoreConfigure = (0, _getStoreConfigure4.default)(),
      compose = _getStoreConfigure.compose,
      enhance = _getStoreConfigure.enhance;

  _core2.default.createConfigureStore(compose, enhance);

  _store = _core2.default.createStore();

  var App = function App() {
    return _react2.default.createElement(
      _reactRedux.Provider,
      { store: _store },
      _react2.default.createElement(Root, null)
    );
  };
  _reactDom2.default.render(_react2.default.createElement(App, null), document.getElementById(domId));
}

function _createStore() {
  var _getStoreConfigure2 = (0, _getStoreConfigure4.default)(),
      compose = _getStoreConfigure2.compose,
      enhance = _getStoreConfigure2.enhance;

  _core2.default.createConfigureStore(compose, enhance);

  _store = _core2.default.createStore();
  return _store;
}

function _ajax() {
  var baseUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var options = arguments[1];

  options.responseType = options.responseType || "json";
  options.url = baseUrl + (options.url ? options.url : "");
  return (0, _ajax2.ajax)(_extends({}, options));
}

function _connect(namespace) {
  var mapToState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var mapToProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  return function (cmp) {
    var model = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    var obj = _core2.default.getStateAndPropsKeys(namespace);
    var mapToPropsObj = {},
        mapToStateArr = [],
        mapToPropsArr = [],
        mapToStateFunc = null;
    //先判断
    if (!obj.stateKeys || !obj.reducerKeys) {
      if (model) {
        _core2.default.addModel(model);
        obj = _core2.default.getStateAndPropsKeys(namespace);
      } else {
        return cmp;
      }
    }
    if (!mapToState) {
      mapToStateArr = obj.stateKeys;
    } else {
      mapToStateArr = _isArray(mapToState) ? mapToState : [mapToState];
    }
    if (!mapToProps) {
      mapToPropsArr = obj.reducerKeys;
    } else {
      mapToPropsArr = _isArray(mapToProps) ? mapToProps : [mapToProps];
    }
    if (mapToStateArr.length > 0) {
      mapToStateFunc = function mapToStateFunc(state) {
        var mapToStateObj = {};
        for (var index = 0; index < mapToStateArr.length; index++) {
          var tmpKey = mapToStateArr[index];
          if (state[namespace][tmpKey]) {
            mapToStateObj[tmpKey] = state[namespace][tmpKey];
          }
        }
        return _extends({}, mapToStateObj);
      };
    }
    if (mapToPropsArr.length > 0) {
      for (var index1 = 0; index1 < mapToPropsArr.length; index1++) {
        var tmpKey1 = mapToPropsArr[index1];
        mapToPropsObj[tmpKey1] = _core2.default.createAction(namespace + '/' + tmpKey1);
      }
    }

    return (0, _reactRedux.connect)(mapToStateFunc, mapToPropsObj)(cmp);
  };
}

exports.default = {
  addModel: _core2.default.addModel,
  createAction: _core2.default.createAction,
  addReducer: _core2.default.addReducer,
  addEpic: _core2.default.addEpic,
  addPlugin: _core2.default.addPlugin,
  addMiddleware: _core2.default.addMiddleware,
  start: _start,
  getStore: _getStore,
  createStore: _createStore,
  ajax: _ajax,
  connect: _connect
};