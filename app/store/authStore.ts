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
  isEmailVerified?: boolean;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  deviceId: string | null;
  deviceName: string | null;
  logout: () => void;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  setUser: (user: User) => void;
  setAccessToken: (accessToken: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  setDeviceId: (deviceId: string) => void;
  setDeviceName: (deviceName: string) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      deviceId: null,
      deviceName: null,
      hasHydrated: false,
      
      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          // Keep deviceId and deviceName for future logins
          hasHydrated: true,
        }),
      
      setHasHydrated: (state) => set({ hasHydrated: state }),
      setUser: (user: User) => set({ user }),
      setAccessToken: (accessToken: string) => set({ accessToken }),
      setRefreshToken: (refreshToken: string) => set({ refreshToken }),
      setDeviceId: (deviceId: string) => set({ deviceId }),
      setDeviceName: (deviceName: string) => set({ deviceName }),
    }),

    {
      name: "auth-storage",
      
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        deviceId: state.deviceId,
        deviceName: state.deviceName,
      }),
      
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);