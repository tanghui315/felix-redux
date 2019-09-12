import React from 'react';
import ReactDOM from 'react-dom';
import {Provider,connect} from 'react-redux';
import core from './core';
import getStoreConfigure from "./getStoreConfigure";
import { ajax } from 'rxjs/observable/dom/ajax';

let _store;

function _isArray(something){
  return Object.prototype.toString.call(something) === '[object Array]';
}

function _getStore() {
  return _store;
}

function _start(Root, domId) {
  const {compose, enhance} = getStoreConfigure();
  core.createConfigureStore(compose, enhance);

  _store = core.createStore();

  const App = () => {
    return (
      <Provider store={_store}>
        <Root />
      </Provider>
    );
  };
  ReactDOM.render(<App />, document.getElementById(domId));
}

function _createStore(){
  const {compose, enhance} = getStoreConfigure();
  core.createConfigureStore(compose, enhance);

  _store = core.createStore();
  return _store
}

function _ajax(baseUrl="",options){
  options.responseType=options.responseType||"json"
  options.url = baseUrl+(options.url?options.url:"")
  return ajax({...options})
}

function _connect(namespace,mapToState=null,mapToProps=null) {
   return (cmp,model=null)=>{
      let obj=core.getStateAndPropsKeys(namespace)
      let mapToPropsObj ={},
       mapToStateArr = [],
       mapToPropsArr =[],
       mapToStateFunc=null
       //先判断
      if(!obj.stateKeys || !obj.reducerKeys){
         if(model){
            core.addModel(model)
            obj=core.getStateAndPropsKeys(namespace)
         }else{
           return cmp
         }
      }
      if(!mapToState){
         mapToStateArr=obj.stateKeys
      }else{
         mapToStateArr=_isArray(mapToState)?mapToState:[mapToState]
      }
      if(!mapToProps){
          mapToPropsArr=obj.reducerKeys
      }else{
          mapToPropsArr=_isArray(mapToProps)?mapToProps:[mapToProps]
      }
      if(mapToStateArr.length>0){
        mapToStateFunc = (state)=>{
          let mapToStateObj = {}
          for (let index = 0; index < mapToStateArr.length; index++) {
            const tmpKey = mapToStateArr[index];
            if(state[namespace][tmpKey]){
              mapToStateObj[tmpKey]=state[namespace][tmpKey]
            }
          }
          return {...mapToStateObj}
        }        
      }
      if(mapToPropsArr.length>0){
         for (let index1 = 0; index1 < mapToPropsArr.length; index1++) {
           const tmpKey1 = mapToPropsArr[index1];
           mapToPropsObj[tmpKey1] = core.createAction(`${namespace}/${tmpKey1}`)
         }
      }
      

      return connect(mapToStateFunc,mapToPropsObj)(cmp)
   }  
}


export default {
  addModel: core.addModel,
  createAction: core.createAction,
  addReducer: core.addReducer,
  addEpic: core.addEpic,
  addPlugin: core.addPlugin,
  addMiddleware: core.addMiddleware,
  start: _start,
  getStore: _getStore,
  createStore:_createStore,
  ajax:_ajax,
  connect:_connect
}
