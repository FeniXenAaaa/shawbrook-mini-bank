import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initAuthListener } from "@/src/feature/auth/authSlice";
import { authenticate } from "@/modules/@shawbrook/module-authentication";
import * as SplashScreen from "expo-splash-screen";
import { Appearance } from "react-native";
import { store } from "@/src/store";
import { updateSystemTheme, loadTheme } from "@/src/feature/theme/themeSlice";

export const startAppInit = createAsyncThunk(
  "app/init",
  async (_, { dispatch }) => {
    try {
      dispatch(setAppInitState("pending"));
      await dispatch(loadTheme());
      dispatch(initAuthListener());

      Appearance.addChangeListener(({ colorScheme }) => {
        if (colorScheme) {
          store.dispatch(
            updateSystemTheme(colorScheme === "dark" ? "dark" : "light"),
          );
        }
      });

      await authenticate();
      SplashScreen.hide();

      dispatch(setAppInitState("success"));
    } catch (e) {
      console.error("App init error. ", e);
      dispatch(setAppInitState("error"));
    }
  },
);

interface IApp {
  initState: "idle" | "pending" | "success" | "error";
}

const initialState: IApp = {
  initState: "idle",
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAppInitState: (state, action: PayloadAction<IApp["initState"]>) => {
      state.initState = action.payload;
    },
  },
});

export const { setAppInitState } = appSlice.actions;
