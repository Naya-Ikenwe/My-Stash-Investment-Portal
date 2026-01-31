import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

type User = {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
  isEmailVerified?: boolean;      // ✅ Added
  isIdentityVerified?: boolean;   // ✅ Added
  [key: string]: any;             // Keep it flexible
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
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  setDeviceId: (id: string) => void;
  setDeviceName: (name: string) => void;
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

      logout: () => {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        Cookies.remove("user");
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          hasHydrated: true,
        });
      },

      setHasHydrated: (state) => set({ hasHydrated: state }),
      setUser: (user) => {
        Cookies.set("user", JSON.stringify(user), { expires: 1, path: "/" });
        set({ user });
      },
      setAccessToken: (token) => {
        Cookies.set("access_token", token, { expires: 1, path: "/" });
        set({ accessToken: token });
      },
      setRefreshToken: (token) => {
        Cookies.set("refresh_token", token, { expires: 7, path: "/" });
        set({ refreshToken: token });
      },
      setDeviceId: (id) => set({ deviceId: id }),
      setDeviceName: (name) => set({ deviceName: name }),
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
        // restore tokens and user from cookies
        const accessToken = Cookies.get("access_token");
        const refreshToken = Cookies.get("refresh_token");
        const user = Cookies.get("user");

        if (accessToken) state?.setAccessToken(accessToken);
        if (refreshToken) state?.setRefreshToken(refreshToken);
        if (user) state?.setUser(JSON.parse(user));

        state?.setHasHydrated(true);
      },
    }
  )
);
