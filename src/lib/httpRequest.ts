import axios from "axios";
import { useAuth } from "../stores/authStore";
export const instance = axios.create({
  baseURL: "https://instagram.f8team.dev/api",
});
type RefreshTokenResponse = {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
};
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// let refreshPromise: Promise<any> | null = null;
let refreshPromise: Promise<RefreshTokenResponse | undefined> | null = null;
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log(error.response);
    if (error.response.status === 401) {
      if (!refreshPromise) {
        refreshPromise = useAuth.getState().refreshAccessToken();
      }
      try {
        await refreshPromise;
      } finally {
        refreshPromise = null;
      }
      return instance(error.config);
    }
    return Promise.reject(error);
  },
);
