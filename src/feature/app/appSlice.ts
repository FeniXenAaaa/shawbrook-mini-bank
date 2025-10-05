import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initAuthListener } from '@/src/feature/auth/authSlice';
import { authenticate } from '@/modules/@shawbrook/module-authentication';
import * as SplashScreen from 'expo-splash-screen';

export const startAppInit = createAsyncThunk(
  "app/init",
  async (args, { dispatch }) => {
    try {
      dispatch(setAppInitState("pending"));
      console.log("console.log(dispatch(setAppInitState(\"pending\"));)")
      dispatch(initAuthListener());

      await authenticate();
      SplashScreen.hide();

      //TODO: Get pre-load non-sensitive data
      //eg.: home page promotions, user settings, etc.

      dispatch(setAppInitState("success"));
    } catch (e) {
      console.error("App init error. ", e);
      dispatch(setAppInitState("error"));
    }
  }
);

interface IApp {
  initState: "idle" | "pending" | "success" | "error";
}

const initialState = {
  initState: "idle",
} as IApp;

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAppInitState: (state, action: PayloadAction<IApp["initState"]>) => {
      state.initState = action.payload;
    },
  }
});

export const { setAppInitState } = appSlice.actions;
