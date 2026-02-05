import { create } from "zustand";
type LoginPayload = {
  email: string;
  password: string;
};
type User = {
  _id: string;
  email: string;
  username: string;
  fullName: string;
  gender: string;
  website: string;
  profilePicture: string | null;
};
type UserStore = {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  login: (data: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<RefreshTokenResponse | undefined>;
};
type RefreshTokenResponse = {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
};
export const useAuth = create<UserStore>((set, get) => ({
  token: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  user: JSON.parse(localStorage.getItem("user") ?? "null"),
  login: async (payload) => {
    try {
      const res = await fetch(`https://instagram.f8team.dev/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error("Login failed");
      }
      const user = await res.json();
      set({
        token: user.data.tokens.accessToken,
        user: user.data.user,
        refreshToken: user.data.tokens.refreshToken,
      });
      localStorage.setItem("accessToken", user.data.tokens.accessToken);
      localStorage.setItem("refreshToken", user.data.tokens.refreshToken);
      localStorage.setItem("user", JSON.stringify(user.data.user));
    } catch (error) {
      console.log(error);
    }
  },
  logout: async () => {
    const token = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    set({ token: null, user: null, refreshToken: null });
    localStorage.clear();
    try {
      const res = await fetch(`https://instagram.f8team.dev/api/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: refreshToken,
        }),
      });
      if (!res.ok) {
        throw new Error("Fetch api lỗi");
      }
    } catch (error) {
      console.log(error);
    }
  },
  refreshAccessToken: async (): Promise<RefreshTokenResponse | undefined> => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return;
    try {
      const res = await fetch(
        `https://instagram.f8team.dev/api/auth/refresh-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        },
      );
      if (!res.ok) {
        get().logout();
        throw new Error("Unathorize");
      }
      const data: RefreshTokenResponse = await res.json();
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
      set({
        token: data.data.accessToken,
        refreshToken: data.data.refreshToken,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
}));
