import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import RootReducer from "./slices";

const middleware = [
  ...getDefaultMiddleware({ thunk: true, serializableCheck: false }),
];

const store = configureStore({
  reducer: RootReducer,
  middleware,
});

export default store;
