import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeState = {
  mode: "light" | "dark" | "system";
  current: "light" | "dark";
};

const THEME_KEY = "app_theme";

export const loadTheme = createAsyncThunk(
  "theme/load",
  async (_, { dispatch }) => {
    try {
      const saved = await AsyncStorage.getItem(THEME_KEY);
      if (saved === "light" || saved === "dark" || saved === "system") {
        dispatch(setMode(saved));
      }
      return saved; // optional: can be used in extraReducers
    } catch (e) {
      console.error("Failed to load theme", e);
      throw e;
    }
  },
);

export const persistTheme = createAsyncThunk(
  "theme/persist",
  async (mode: "light" | "dark" | "system", { dispatch }) => {
    try {
      await AsyncStorage.setItem(THEME_KEY, mode);
      dispatch(setMode(mode));
      return mode; // optional: can be used in extraReducers
    } catch (e) {
      console.error("Failed to persist theme", e);
      throw e;
    }
  },
);

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
        state.current =
          Appearance.getColorScheme() === "dark" ? "dark" : "light";
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
