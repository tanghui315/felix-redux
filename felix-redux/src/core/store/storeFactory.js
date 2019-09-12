/**
 * Created by Felix on 2019/9/9.
 */
import createStore from './store'

const storeFactory = (compose, ...enhances) => {
  return (rootReducer, epicMiddleware) => {
    return createStore(compose, enhances.filter((enhance) => {
      return !!enhance;
    }))(rootReducer, epicMiddleware.filter((middle) => {
      return !!middle;
    }));
  }
};

export default storeFactory;

