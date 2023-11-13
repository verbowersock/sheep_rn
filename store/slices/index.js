import { combineReducers } from "redux";
import sheepReducer from "./sheep";
import attributesDataReducer from "./attributes";
import uiReducer from "./ui";

const Rootreducers = combineReducers({
  // reducers
  ui: uiReducer,
  sheep: sheepReducer,
  attributes: attributesDataReducer,
});

export default Rootreducers;
