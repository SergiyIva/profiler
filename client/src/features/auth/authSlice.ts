import { User } from "../../services/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";

type AuthState = {
  user?: User;
};

const slice = createSlice({
  name: "auth",
  initialState: { user: undefined } as AuthState,
  reducers: {
    setAuth: (
      state,
      { payload: { user } }: PayloadAction<Required<AuthState>>,
    ) => {
      state.user = user;
    },
    setNoAuth: (state) => (state.user = undefined),
  },
});

export const { setAuth, setNoAuth } = slice.actions;
export default slice.reducer;
export const selectCurrentUser = (state: RootState) => state.auth.user;
