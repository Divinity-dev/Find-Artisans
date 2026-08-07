import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {
    // =========================
    // REGISTER
    // =========================

    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    registerSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },

    registerFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // =========================
    // LOGIN
    // =========================

    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },

    setUser: (state, action) => {
    state.user = action.payload
  },

    loginFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },

    // =========================
    // LOGOUT
    // =========================

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const {
  registerStart,
  registerSuccess,
  registerFail,
setUser,
  loginStart,
  loginSuccess,
  loginFail,

  logout,
} = authSlice.actions;

export default authSlice.reducer;