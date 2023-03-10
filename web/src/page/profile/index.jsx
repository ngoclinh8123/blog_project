import { useEffect, useState, useContext } from "react";
import api, { setOnTokenRefreshed } from "/src/service/axios/api";
import { AuthContext } from "/src/util/context/auth_context";
import styles from "./profile.module.css";

function Profile() {
  const [user, setUser] = useState({});
  const [refresh, setRefresh] = useState(false);
  const { handleLogin } = useContext(AuthContext);

  // Use an effect hook to fetch the user information from the API when the refresh flag changes
  useEffect(() => {
    api
      .get("/auth/user_info/")
      .then((response) => {
        if (response) {
          setUser(response.data["data"]);
          handleLogin();
        }
      })
      .catch((e) => {});
  }, [refresh]);

  // Use an effect hook to set the onTokenRefreshed callback to update the refresh flag
  useEffect(() => {
    setOnTokenRefreshed(() => {
      setRefresh(true);
    });
  }, []);

  return (
    <div className={styles.container}>
      <div>
        <span>User name: </span>
        <span>{user.username}</span>
      </div>
      <div>
        <span>Email: </span>
        <span>{user.email}</span>
      </div>
      <div>
        <span>First name: </span>
        <span>{user.first_name}</span>
      </div>
      <div>
        <span>Last name: </span>
        <span>{user.last_name}</span>
      </div>
      <div>
        <span>Date joined: </span>
        <span>{user.date_joined}</span>
      </div>
    </div>
  );
}

export default Profile;
