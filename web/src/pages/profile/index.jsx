import { useEffect, useState } from "react";
import styles from "./profile.module.scss";
import api, { setOnTokenRefreshed } from "../../service/axios/api";

function Profile() {
  const [user, setUser] = useState({});
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    api
      .get("/auth/user_info/")
      .then((response) => {
        if (response) {
          setUser(response.data["data"]);
        }
      })
      .catch((e) => {});
  }, [refresh]);

  useEffect(() => {
    // Đăng ký hàm setRefresh cho api
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
