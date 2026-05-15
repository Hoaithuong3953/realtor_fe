import { create } from "zustand"
import { persist } from "zustand/middleware"

import { STORAGE_KEYS } from "@/constants/auth"
import type { AuthUserOut } from "@/types"

interface AuthState {
  user: AuthUserOut | null
  accessToken: string | null
  isAuthenticated: boolean
  setLoginSuccess: (user: AuthUserOut, accessToken: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setLoginSuccess: (user, accessToken) => {
        set({ user, accessToken, isAuthenticated: true })
      },
      logout: () => {
        set({ user: null, accessToken: null, isAuthenticated: false })
      },
    }),
    {
      name: STORAGE_KEYS.AUTH_STORE,
      version: 1,
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
