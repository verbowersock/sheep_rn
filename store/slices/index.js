import { combineReducers } from "redux";
import sheepReducer from "./sheep";
import attributesDataReducer from "./attributes";
import uiReducer from "./ui";
import settingsReducer from "./settings";

const Rootreducers = combineReducers({
  // reducers
  ui: uiReducer,
  sheep: sheepReducer,
  attributes: attributesDataReducer,
  settings: settingsReducer,
});

export default Rootreducers;
