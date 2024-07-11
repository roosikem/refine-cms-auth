import type { AuthProvider } from "@refinedev/core";
import { jwtDecode } from "jwt-decode";
export const TOKEN_K = "token";
export const TOKEN_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ewogICJyb2xlIjogIkRlZmF1bHQiLAogICJwZXJtaXNzaW9ucyI6IFsKICAgIHsKICAgICAgImF1dGhvcml0eSI6ICJSRUFEX09OTFkiCiAgICB9LAogICAgewogICAgICAgImF1dGhvcml0eSI6ICJSRUFEX1dSSVRFIgogICAgfQogIF0sIAogICJpYXQiOiAxNDAwMDYyNDAwMjIzLAogICJleHAiOiAxODAwMDYyNDAwMjIzLAogICJzdWIiOiAiTWFuaXNoIgp9.9lVP2VJyQJXeqmYXaB5skjzGjl3SVqff4ZNSnl4czLg";
export const authProvider: AuthProvider = {
  login: async ({ username, email, password }) => {
    console.log("login")
    if ((username || email) && password) {
      localStorage.setItem(TOKEN_K, TOKEN_KEY);
      return {
        success: true,
        redirectTo: "/",
      };
    }

    return {
      success: false,
      error: {
        name: "LoginError",
        message: "Invalid username or password",
      },
    };
  },
  logout: async () => {
    localStorage.removeItem(TOKEN_K);
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async () => {
    const token = localStorage.getItem(TOKEN_K);
    if (token) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => {
    const token = localStorage.getItem(TOKEN_K);
    if (token) {
        const decodedToken = jwtDecode(token) as any;
        console.log(decodedToken)
        return Promise.resolve(decodedToken.permissions);
    }
    return Promise.resolve();
},
getIdentity: async () => {
    const user = localStorage.getItem("user");
    if (user) {
        return Promise.resolve(JSON.parse(user));
    }
    return Promise.resolve();
},

  onError: async (error) => {
    console.error(error);
    return { error };
  },
};
