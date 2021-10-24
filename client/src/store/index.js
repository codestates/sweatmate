import { createStore } from "redux";
import reducers from "./reducers";

/* eslint-disable no-underscore-dangle */
const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // Redux DevTools Extension
);
/* eslint-enable */

export default store;
