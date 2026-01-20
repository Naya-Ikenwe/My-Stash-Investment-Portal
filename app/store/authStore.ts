import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: string;
  email: string;
  username: string;
  tenant: string;
  emailVerifiedAt: string | null;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  credentialStatus: string;
  middleName: string;
  motherMaidenName: string;
  residentialAddress: string;
  country: string;
  gender: string;
  title: string;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  logout: () => void;
  hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
  setUser: (user: User) => void;
  setAccessToken: (accessToken: string) => void;
  setRefreshToken: (refreshToken: string) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      hasHydrated: false,
      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          hasHydrated: true,
        }),
      
      setHasHydrated: (state) => set({ hasHydrated: state }),
      setUser: (user: User) => set({ user }),
      setAccessToken: (accessToken: string) => set({ accessToken }),
      setRefreshToken: (refreshToken: string) => set({ refreshToken }),
    }),

    {
      name: "auth-storage",
      
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
);
