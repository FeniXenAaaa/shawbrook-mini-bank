import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppDispatch } from "@/src/store";

export type ThemeState = {
  mode: "light" | "dark" | "system";
  current: "light" | "dark";
};

const THEME_KEY = "app_theme";

export const persistTheme = (mode: "light" | "dark" | "system") => async (dispatch: AppDispatch) => {
  try {
    await AsyncStorage.setItem(THEME_KEY, mode);
    dispatch(setMode(mode));
  } catch (e) {
    console.error("Failed to persist theme", e);
  }
};

export const loadTheme = () => async (dispatch: AppDispatch) => {
  try {
    const saved = await AsyncStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark" || saved === "system") {
      dispatch(setMode(saved));
    }
  } catch (e) {
    console.error("Failed to load theme", e);
  }
};


const systemTheme = Appearance.getColorScheme() === "dark" ? "dark" : "light";

const initialState: ThemeState = {
  mode: "system",
  current: systemTheme,
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setMode(state, action: PayloadAction<"light" | "dark" | "system">) {
      state.mode = action.payload;
      if (state.mode === "system") {
        state.current = Appearance.getColorScheme() === "dark" ? "dark" : "light";
      } else {
        state.current = state.mode;
      }
    },
    updateSystemTheme(state, action: PayloadAction<"light" | "dark">) {
      if (state.mode === "system") {
        state.current = action.payload;
      }
    },
  },
});

export const { setMode, updateSystemTheme } = themeSlice.actions;
