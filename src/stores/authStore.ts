import { create } from "zustand";
type LoginPayload = {
  email: string;
  password: string;
};
type User = {
  id: string;
  email: string;
  username: string;
  fullname: string;
  gender: string;
  website: string;
  profilePicture: string | null;
};
type UserStore = {
  token: string | null;
  user: User | null;
  login: (data: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
};
type LogoutResponse = {
  success: boolean;
  message: string;
  data: null;
};

export const useAuth = create<UserStore>((set, get) => ({
  token: localStorage.getItem("accessToken"),
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
      if (user) {
        localStorage.setItem("accessToken", user.data.tokens.accessToken);
        set({ token: user.data.tokens.accessToken, user: user.data.user });
        localStorage.setItem("refreshToken", user.data.tokens.refreshToken);
        localStorage.setItem("user", JSON.stringify(user.data.user));
      }
    } catch (error) {
      console.log(error);
    }
  },
  logout: async () => {
    try {
      const res = await fetch(`https://instagram.f8team.dev/api/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${get().token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: localStorage.getItem("refreshToken"),
        }),
      });
      if (!res.ok) {
        throw new Error("Fetch api lỗi");
      }
      const data: LogoutResponse = await res.json();
      if (data.success) {
        set({ token: null, user: null });
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.log(error);
    }
  },
}));
