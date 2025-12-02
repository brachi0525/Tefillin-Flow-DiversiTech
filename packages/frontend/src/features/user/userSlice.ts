import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./userTypes";

function loadUserFromLocalStorage(): User | null {
  try {
    const stored = localStorage.getItem("user");
    if (!stored) return null;

    const parsed = JSON.parse(stored) as User;

    // המרת תאריכים
    if (parsed.createdAt) parsed.createdAt = new Date(parsed.createdAt);
    if (parsed.updatedAt) parsed.updatedAt = new Date(parsed.updatedAt);
    if (parsed.lastLogin) parsed.lastLogin = new Date(parsed.lastLogin);

    return parsed;
  } catch (err) {
    console.error("שגיאה בטעינת משתמש מה־localStorage", err);
    return null;
  }
}

interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: loadUserFromLocalStorage(),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    clearUser: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export const currentUser = (state: { user: UserState }) => state.user.user;
export default userSlice.reducer;
