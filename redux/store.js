import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

import {
  persistStore,
  persistReducer,
} from 'redux-persist';

import storage from 'redux-persist/lib/storage'; // localStorage for web

// 1. Persist Config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // only persist auth
};

// 2. Combine reducers (important for persist)
const rootReducer = combineReducers({
  auth: authReducer,
});

// 3. Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

// 5. Persistor
export const persistor = persistStore(store);