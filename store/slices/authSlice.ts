import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginUser, registerUser, logoutUser } from "@/store/thunks";

export interface User {
  id: string;
  name?: string;
  nome?: string;
  username?: string;
  email: string;
  password?: string;
  token?: string;
  dataCriacao?: string;
}

export interface AuthPayload {
  token: string | null;
  user: User | null;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  usesBankingApi: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  usesBankingApi: process.env.NEXT_PUBLIC_USE_BANKING_API === 'true',
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      if (action.payload) {
        state.user = action.payload;
        state.isAuthenticated = true;
      } else {
        state.user = null;
        state.isAuthenticated = false;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    // Login com API Bancária
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log('[authSlice] loginUser.fulfilled - payload:', action.payload);
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token || null;
        state.user = action.payload.user || null;
        state.usesBankingApi = true;
        state.error = null;
        console.log('[authSlice] loginUser.fulfilled - new state:', { isAuthenticated: state.isAuthenticated, token: state.token });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Registrar com API Bancária
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token || null;
        state.user = action.payload.user || null;
        state.usesBankingApi = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Logout com API Bancária
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.usesBankingApi = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setLoading,
  loginSuccess,
  loginFailure,
  logout,
  setUser,
  clearError,
  setToken,
} = authSlice.actions;

export default authSlice.reducer;
