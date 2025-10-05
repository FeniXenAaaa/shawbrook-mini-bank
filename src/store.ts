import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authSlice } from "@/src/feature/auth/authSlice";
import { appSlice } from "@/src/feature/app/appSlice";
import { themeSlice } from "@/src/feature/theme/themeSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    app: appSlice.reducer,
    theme: themeSlice.reducer,
  },
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
