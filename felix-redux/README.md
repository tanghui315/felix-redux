# Felix-redux
Inspired by Dva.  
basic package based on reudx, redux-observable.

#### compared to dva：
##### G：
* 没有侵入性
* 预留default reducer处理，支持高阶reducer
* 对旧项目友好，改造成本极低
* 能够使用rx 方法，对异步有强处理能力
* 支持hooks,可以用useSelector, useDispatch

##### NG:
* 强依赖rxjs，比较笨重


### Install
```
npm install felix-redux
```

### peer dependency
```
    "react",
    "react-dom",
    "react-redux",
    "redux",
    "redux-observable",
    "rxjs",
```

### Usage

write model:
```
const model = {
  namespace: 'coupon',
  state: {
    itemDataList: [],
  },
  epics:{
    loadData:(action$, store) => action$.pipe(
            ofType("coupon/loadData"),
            switchMap(action=>{
               const {payload:{ excludeEncounterId,pageNo,pageSize,patientId } } = action
               return felix.ajax(config.baseUrl,{url:`emr/encounter/quick-order?pageNo=${pageNo}&pageSize=${pageSize}&patientId=${patientId}&excludeEncounterId=${excludeEncounterId}`,method: 'GET'})
            }),
            map(res => res.response || res),
            map(res => ({type:"updateItemDataList",res}))
      )
  },
  reducers: {
    showLoading(state, action){
      return {...state, loading: true};
    },
    // handle high order reducer
    updateItemDataList:(state,action)=>{
       return {...state,itemDataList:action.res}
    }
  }
};


export default model;
```

write page:
```
import React,{PureComponent} from 'react';
import {connect} from 'react-redux';
import felix from 'felix-redux';

const {createAction} = felix;

class Page extends PureComponent{
  constructor(props){
    super(props);
  }

  componentDidMount(){
    this.props.loadData();
  }


  render(){
    console.log(this.props);

    return (
      <div>
        this is page super
      </div>
    );
  }
}


export default felix.connect("coupon")(Page);
```

write entry file:
```
import felix from 'felix-redux';
import model from './activity/demo/model';
import Page from "./activity/demo/Page";
import {Provider} from 'react-redux';

felix.addModel(model);

const store =felix.createStore()

<Provider store={store}>
    <Page />
</Provider>

```

### API

```
addModel(model) : add model for felix-redux
```

```
start(Root, 'domId'): start felix-redux
```

```
createAction(actionName): simple action create for connect view
```

```
addReducer(reducerKey, reducerHandle): push origin reducer handle to felix-redux control
```

```
addEpic(epic or epic Array): push origin epic to felix-redux control
```

```
addPlugin(pluginKey, plugin): inject dependency to redux-observable
```

```
addMiddleware(middlewares or middleware): redux middleware
```

```
ajax(config): ajax request
```

```
connect(namespace,mapToState,mapToProps): felix redux connect
```
### TODO
* [ ] replece reducer
* [ ] reducer version conflict
* [ ] epic replace
* [ ] plugin system(doing)
