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
  isEmailVerified?: boolean;
  isIdentityVerified?: boolean;
  [key: string]: any;
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
  setUser: (userData: Partial<User> | null) => void;
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  setDeviceId: (id: string) => void;
  setDeviceName: (name: string) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
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
        // Don't remove phone cookie - keep it for next login
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          deviceId: null,
          deviceName: null,
          hasHydrated: true,
        });
      },

      setHasHydrated: (state) => set({ hasHydrated: state }),
      
      setUser: (userData) => {
        if (!userData) {
          Cookies.remove("user");
          set({ user: null });
          return;
        }
        
        const currentUser = get().user;
        
        // Get phone from multiple sources in priority order
        const phoneFromCookie = Cookies.get("user_phone") || "";
        const phone = userData.phone || currentUser?.phone || phoneFromCookie || "";
        
        // Always save phone to separate long-term cookie
        if (phone) {
          Cookies.set("user_phone", phone, { expires: 30, path: "/" });
        }
        
        const mergedUser = {
          ...currentUser,
          ...userData,
          phone: phone,
        } as User;
        
        Cookies.set("user", JSON.stringify(mergedUser), { expires: 1, path: "/" });
        set({ user: mergedUser });
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
        const accessToken = Cookies.get("access_token");
        const refreshToken = Cookies.get("refresh_token");
        const user = Cookies.get("user");
        const phoneCookie = Cookies.get("user_phone");

        if (accessToken) state?.setAccessToken(accessToken);
        if (refreshToken) state?.setRefreshToken(refreshToken);
        
        if (user) {
          try {
            const parsedUser = JSON.parse(user);
            // If user from cookie has no phone but we have phone cookie, add it
            if (!parsedUser.phone && phoneCookie) {
              parsedUser.phone = phoneCookie;
            }
            state?.setUser(parsedUser);
          } catch (e) {
            // Failed to parse user cookie
          }
        }

        state?.setHasHydrated(true);
      },
    },
  ),
);