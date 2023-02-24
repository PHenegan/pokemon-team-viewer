import { useState } from "react";
import Card from "../UI/Card";
import "./LoginForm.css";

export default function LoginForm(props) {
  const [enteredUsername, setEnteredUsername] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");

  async function newUserHandler(event) {
    event.preventDefault();
    await props.makeNewUser(enteredUsername, enteredPassword);
    setEnteredUsername("");
    setEnteredPassword("");
  }

  async function loginHandler(event) {
    event.preventDefault();
    props.tryLogin(enteredUsername, enteredPassword);
    setEnteredUsername("");
    setEnteredPassword("");
  }

  return (
    <Card className="login-form">
      <form>
        <div>
          <label>Username:</label>
        </div>
        <input
          type="text"
          value={enteredUsername}
          placeholder="Enter username here"
          onChange={(event) => {
            setEnteredUsername(event.target.value);
          }}
        />
        <div>
          <label>Password:</label>
        </div>
        <input
          type="password"
          value={enteredPassword}
          placeholder="Enter password here"
          onChange={(event) => {
            setEnteredPassword(event.target.value);
          }}
        ></input>
        <div>
          <button onClick={newUserHandler}>Make new user</button>
          <button onClick={loginHandler}>Sign in</button>
        </div>
      </form>
    </Card>
  );
}
