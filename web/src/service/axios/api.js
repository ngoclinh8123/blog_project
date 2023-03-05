import axios from "axios";
import Cookies from "universal-cookie";

const cookie = new Cookies();
const buffer = [];

const api = axios.create({
  baseURL: import.meta.env.VITE_URL_API,
});

api.interceptors.request.use(
  function (config) {
    // get token from cookie
    const token = cookie.get("token");
    // add token to header
    if (token) {
      config.headers.Authorization = `JWT ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

let onTokenRefreshed = () => {};
export function setOnTokenRefreshed(callback) {
  onTokenRefreshed = callback;
}

function refresh_token() {
  const token = cookie.get("token");
  axios
    .post(`${import.meta.env.VITE_URL_API}/auth/token/refresh/`, {
      refresh: token,
    })
    .then((response) => {
      const new_token = response.data.data.access;
      cookie.set("token", new_token, {
        maxAge: 900,
        path: "/",
      });
      onTokenRefreshed();
    })
    .catch((err) => {});
}

api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response.status == 401) {
      if (error.response.data.code === "token_not_valid") {
        refresh_token();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
