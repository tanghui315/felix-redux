/**
 * Created by Felix on 2019/9/9.
 */
import {applyMiddleware, createStore} from "redux";

export default (compose, enhances) => {
  return (rootReducer, middleWares) => {
    return createStore(
      rootReducer,
      compose(
        applyMiddleware(...middleWares),
        ...enhances
      )
    );
  };
}
