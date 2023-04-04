import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h2>Home page</h2>
      <Link to="/login">
        <h2>Login</h2>
      </Link>
    </div>
  );
}

export default Home;
