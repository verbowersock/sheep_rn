import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import RootReducer from "./slices";
import { persistStore, persistReducer } from "redux-persist";

import AsyncStorage from "@react-native-async-storage/async-storage";
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["settings"],
};

const persistedReducer = persistReducer(persistConfig, RootReducer);

const middleware = [
  ...getDefaultMiddleware({
    thunk: true,
    serializableCheck: false,
    immutableCheck: false,
  }),
];

const store = configureStore({
  reducer: persistedReducer,
  middleware,
});

let persistor = persistStore(store);

export { store, persistor };
