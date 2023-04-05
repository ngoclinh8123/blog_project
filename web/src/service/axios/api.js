import axios from "axios";

// Create an API object with the base URL configured in the VITE_URL_API environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_URL_API,
});

// Add an interceptor to add the access token to the header of API requests
api.interceptors.request.use(
  async (config) => {
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
async function refresh_token() {
  try {
    await axios.post(
      `${import.meta.env.VITE_URL_API}/api/v1/auth/token/refresh/`,
      {}
    );

    // Call the callback function when the access token is refreshed
    onTokenRefreshed();
  } catch (err) {
    // handle error
  }
}

// Add an interceptor to handle authentication errors
api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // If the response status is 401, call the refresh_token() function to refresh the access token
    if (error.response.status == 401) {
      if (
        error.response.data.detail ===
        "Given token not valid for any token type"
      ) {
        refresh_token();
      }
    }
    return Promise.reject(error);
  }
);

// Export the API object for use in other modules
export default api;
