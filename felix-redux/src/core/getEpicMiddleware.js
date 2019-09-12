import {createEpicMiddleware} from "redux-observable";

/**
 * @param epics
 * @param plugins
 * @returns {EpicMiddleware<Action, any, any, Action>}
 */
const getEpicMiddleware = (epics, plugins) => {
  const epicMiddleware = createEpicMiddleware({
    dependencies: plugins || {}
  });
  // epicMiddleware.run(epics);
  return epicMiddleware
};

export default getEpicMiddleware;