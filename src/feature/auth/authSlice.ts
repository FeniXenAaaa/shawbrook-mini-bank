import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addAuthenticationListener } from "@/modules/@shawbrook/module-authentication";

interface IAuth {
  authState: "none" | "authenticated" | "expired";
}

const initialState = {
  authState: "none",
} as IAuth;

export const initAuthListener = createAsyncThunk(
  "auth/initAuthListener",
  async (args, { dispatch }) => {
    try {
      addAuthenticationListener(({ authenticationState }) => {
        console.log("addAuthenticationListener", authenticationState);
        dispatch(setAuthState(authenticationState));
      });
    } catch (e) {
      console.log(`Error in addAuthListener`, e);
    }
  },
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<IAuth["authState"]>) => {
      state.authState = action.payload;
    },
  },
});

export const { setAuthState } = authSlice.actions;
