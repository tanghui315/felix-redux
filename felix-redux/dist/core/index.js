'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = require('react-redux');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reduxObservable = require('redux-observable');

var _miJsUtils = require('mi-js-utils');

var _miJsUtils2 = _interopRequireDefault(_miJsUtils);

var _redux = require('redux');

var _storeFactory = require('./store/storeFactory');

var _storeFactory2 = _interopRequireDefault(_storeFactory);

var _createReducer = require('./createReducer');

var _createReducer2 = _interopRequireDefault(_createReducer);

var _createAction = require('./createAction');

var _getEpicMiddleware = require('./getEpicMiddleware');

var _getEpicMiddleware2 = _interopRequireDefault(_getEpicMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _epics = [];
var _reducersObj = {};
var _plugins = {};
var _middlewares = [];
var _stateKeys = {};
var _reducerKeys = {};

var _configureStore = _miJsUtils2.default.common.noop;

function _addPlugins(key, plugin) {
  _plugins[key] = plugin;
}

function _addMiddleware(middlewares) {
  if (Array.isArray(middlewares)) {
    _middlewares = _middlewares.concat(middlewares);
  } else {
    _middlewares.push(middlewares);
  }
}

function _addEpic(epics) {
  if (epics) {
    _epics = _epics.concat(Object.values(epics));
  }
}

function _addReducer(namespace, initState, handles) {
  _reducersObj[namespace] = (0, _createReducer2.default)(initState, handles);
}

function _addModel(model) {
  var namespace = model.namespace,
      state = model.state,
      epics = model.epics,
      reducers = model.reducers;

  if (_reducersObj[namespace]) {
    return;
  }
  if (state && Object.keys(state).length > 0) {
    for (var key in state) {
      if (state.hasOwnProperty(key)) {
        if (_stateKeys[namespace] && _stateKeys[namespace].indexOf(key) === -1) {
          _stateKeys[namespace].push(key);
        } else {
          _stateKeys[namespace] = [key];
        }
      }
    }
  }

  if (epics) {
    if (Object.keys(epics).length > 0) {
      for (var rkey in epics) {
        if (epics.hasOwnProperty(rkey)) {
          if (_reducerKeys[namespace] && _reducerKeys[namespace].indexOf(rkey) === -1) {
            _reducerKeys[namespace].push(rkey);
          } else {
            _reducerKeys[namespace] = [rkey];
          }
        }
      }
    }
    _addEpic(epics);
  }
  if (reducers) {
    _addReducer(namespace, state || {}, reducers);
  }
}

function _getStateAndPropsKeys(namespace) {
  return {
    stateKeys: _stateKeys[namespace],
    reducerKeys: _reducerKeys[namespace]
  };
}

/**
 * create configure store method
 * @private
 */
function _createConfigureStore() {
  _configureStore = _storeFactory2.default.apply(undefined, arguments);
}

/**
 * create store
 * @private
 */
function _createStore() {
  //start to create store
  var rootEpic = _reduxObservable.combineEpics.apply(undefined, _toConsumableArray(_epics));
  var _trueReducers = (0, _redux.combineReducers)(_reducersObj);

  //TODO extra epic inject plugin
  var epicMiddleware = (0, _getEpicMiddleware2.default)(rootEpic, _plugins);
  //epicMiddleware.run(rootEpic)

  _middlewares.push(epicMiddleware);

  var Store = _configureStore(_trueReducers, _middlewares, rootEpic);
  epicMiddleware.run(rootEpic);
  return Store;
}

function _addOriginReducer(key, reducer) {
  _reducersObj[key] = reducer;
}

function _addOriginEpic(epics) {
  if (Array.isArray(epics)) {
    _epics = _epics.concat(epics);
  } else {
    _epics.push(epics);
  }
}

exports.default = {
  addModel: _addModel,
  createAction: _createAction.createAction,
  addReducer: _addOriginReducer,
  addEpic: _addOriginEpic,
  addPlugin: _addPlugins,
  addMiddleware: _addMiddleware,
  getStateAndPropsKeys: _getStateAndPropsKeys,
  createConfigureStore: _createConfigureStore,
  createStore: _createStore
};