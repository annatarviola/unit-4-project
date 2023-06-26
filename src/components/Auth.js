import { useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../store/authContext";

const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [register, setRegister] = useState(true);

  const authCtx = useContext(AuthContext);

  const baseURL = "https://socialmtn.devmountain.com";

  const body = {
    username,
    password,
  };

  const submitHandler = (e) => {
    e.preventDefault();

    axios
      .post(register ? `${baseURL}/register` : `${baseURL}/login`, body)
      .then((res) => {
        console.log(res.data);
        authCtx.login(res.data.token, res.data.exp, res.data.id);
      })
      .catch((err) => {
        setUsername("");
        setPassword("");
      });

    console.log("submitHandler called");
  };

  return (
    <main>
      <h1>Welcome!</h1>
      <form className="form auth-form" onSubmit={submitHandler}>
        <input
          className="form-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="form-input"
          type="text"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="form-btn">{register ? "Sign Up" : "Login"}</button>
      </form>
      <button className="form-btn" onClick={() => setRegister(!register)}>
        Need to {register ? "Login" : "Sign Up"}?
      </button>
    </main>
  );
};

export default Auth;
