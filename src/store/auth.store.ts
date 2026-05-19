import { create } from "zustand"
import { persist } from "zustand/middleware"

import { STORAGE_KEYS } from "@/constants/auth"
import type { AuthUserOut } from "@/types"

interface AuthState {
  user: AuthUserOut | null
  accessToken: string | null
  isAuthenticated: boolean
  avatarUrl: string | null
  setLoginSuccess: (user: AuthUserOut, accessToken: string) => void
  setAvatar: (avatarUrl: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      avatarUrl: null,
      setLoginSuccess: (user, accessToken) => {
        set({ user, accessToken, isAuthenticated: true })
      },
      setAvatar: (avatarUrl) => {
        set({ avatarUrl })
      },
      logout: () => {
        set({ user: null, accessToken: null, isAuthenticated: false, avatarUrl: null })
      },
    }),
    {
      name: STORAGE_KEYS.AUTH_STORE,
      version: 1,
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
        avatarUrl: state.avatarUrl,
      }),
    }
  )
)
