import axios from "axios";
import Cookies from "universal-cookie";

// Create a cookie object
const cookie = new Cookies();

// Create an API object with the base URL configured in the VITE_URL_API environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_URL_API,
});

// Add an interceptor to add the access token to the header of API requests
api.interceptors.request.use(
  function (config) {
    // Get the access token from the cookie
    const token = cookie.get("token");
    // Add the access token to the header if it exists
    if (token) {
      config.headers.Authorization = `JWT ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Declare a callback function for when the access token is refreshed
let onTokenRefreshed = () => {};
export function setOnTokenRefreshed(callback) {
  onTokenRefreshed = callback;
}

// Function to send a request to refresh the access token
function refresh_token() {
  const token = cookie.get("token");
  axios
    .post(`${import.meta.env.VITE_URL_API}/auth/token/refresh/`, {
      refresh: token,
    })
    .then((response) => {
      const new_token = response.data.data.access;
      // Update the access token
      cookie.set("token", new_token, {
        maxAge: 900,
        path: "/",
      });
      // Call the callback function when the access token is refreshed
      onTokenRefreshed();
    })
    .catch((err) => {});
}

// Add an interceptor to handle authentication errors
api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // If the response status is 401, call the refresh_token() function to refresh the access token
    if (error.response.status == 401) {
      if (error.response.data.code === "token_not_valid") {
        refresh_token();
      }
    }
    return Promise.reject(error);
  }
);

// Export the API object for use in other modules
export default api;
