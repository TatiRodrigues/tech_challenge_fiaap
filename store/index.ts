import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import transactionsReducer from "./slices/transactionsSlice";
import bankingTransactionReducer from "./slices/bankingTransactionSlice";
import {
  loggerMiddleware,
  persistenceMiddleware,
  analyticsMiddleware,
  errorHandlingMiddleware,
  thunkLoggingMiddleware,
} from "./middleware";

const storeConfig = {
  reducer: {
    auth: authReducer,
    transactions: transactionsReducer,
    bankingTransactions: bankingTransactionReducer,
  },
  middleware: (getDefaultMiddleware: any): any =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/loginUser/fulfilled'],
        ignoredPaths: ['auth.user'],
      },
    })
      .concat(loggerMiddleware)
      .concat(persistenceMiddleware)
      .concat(analyticsMiddleware)
      .concat(errorHandlingMiddleware)
      .concat(thunkLoggingMiddleware),
};

export const store = configureStore(storeConfig);

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
