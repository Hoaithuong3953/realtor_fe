import { create } from "zustand"
import { persist } from "zustand/middleware"

import { STORAGE_KEYS } from "@/constants/auth"
import type { AuthUserOut } from "@/types"

interface AuthState {
  user: AuthUserOut | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  setLoginSuccess: (user: AuthUserOut, accessToken: string, refreshToken: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setLoginSuccess: (user, accessToken, refreshToken) => {
        set({ user, accessToken, refreshToken, isAuthenticated: true })
      },
      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false })
      },
    }),
    {
      name: STORAGE_KEYS.AUTH_STORE,
      version: 1,
      // Persists session states including refreshToken to localStorage to survive tab closure and reloads
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
