import {Provider} from "react-redux";
import React from 'react';
import {combineEpics} from 'redux-observable';
import UTILS from 'mi-js-utils';
import {combineReducers} from "redux";
import storeFactory from "./store/storeFactory";
import createReducer from "./createReducer";
import {createAction} from './createAction';
import getEpicMiddleware from "./getEpicMiddleware";


let _epics = [];
let _reducersObj = {};
let _plugins = {};
let _middlewares = [];
let _stateKeys = {};
let _reducerKeys = {}

let _configureStore = UTILS.common.noop;

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
  _reducersObj[namespace] = createReducer(initState, handles);
}

function _addModel(model) {
  const {namespace, state, epics, reducers} = model;
  if(_reducersObj[namespace]){
    return
  }
  if(state&&Object.keys(state).length>0){
    for (const key in state) {
      if (state.hasOwnProperty(key)) {
         if(_stateKeys[namespace]&&_stateKeys[namespace].indexOf(key)===-1){
           _stateKeys[namespace].push(key);
         }else{
           _stateKeys[namespace]=[key];
         }
      }
    }
  }


  if (epics) {
    if(Object.keys(epics).length>0){
      for (const rkey in epics) {
        if (epics.hasOwnProperty(rkey)) {
            if(_reducerKeys[namespace]&&_reducerKeys[namespace].indexOf(rkey)===-1){
               _reducerKeys[namespace].push(rkey);
            }else{
              _reducerKeys[namespace]=[rkey];
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

function _getStateAndPropsKeys(namespace){
   return {
      stateKeys:_stateKeys[namespace],
      reducerKeys:_reducerKeys[namespace],
   }
}

/**
 * create configure store method
 * @private
 */
function _createConfigureStore(...args){
  _configureStore = storeFactory(...args);
}

/**
 * create store
 * @private
 */
function _createStore() {
  //start to create store
  const rootEpic = combineEpics(..._epics);
  const _trueReducers = combineReducers(_reducersObj);

  //TODO extra epic inject plugin
  const epicMiddleware = getEpicMiddleware(rootEpic, _plugins);
  //epicMiddleware.run(rootEpic)

  _middlewares.push(epicMiddleware);

 const Store= _configureStore(_trueReducers, _middlewares);
 epicMiddleware.run(rootEpic);
 return Store
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

export default {
  addModel: _addModel,
  createAction,
  addReducer: _addOriginReducer,
  addEpic: _addOriginEpic,
  addPlugin: _addPlugins,
  addMiddleware: _addMiddleware,
  getStateAndPropsKeys:_getStateAndPropsKeys,
  createConfigureStore: _createConfigureStore,
  createStore: _createStore,
}

