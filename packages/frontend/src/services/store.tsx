import { configureStore } from '@reduxjs/toolkit';
import { apiClient } from './apiClient'; 
import userReducer from "../features/user/userSlice";
import soldierReducer from "../features/soldier/soldierSlice";

const store = configureStore({
  reducer: {
    [apiClient.reducerPath]: apiClient.reducer, 
    user: userReducer,
    soldier: soldierReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiClient.middleware)
});

export default store;
