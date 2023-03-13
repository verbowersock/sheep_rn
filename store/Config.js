import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import RootReducer from "./slices";

const middleware = [
  ...getDefaultMiddleware({ thunk: true, serializableCheck: false }),
];

export default configureStore({
  reducer: RootReducer,
  middleware,
});
