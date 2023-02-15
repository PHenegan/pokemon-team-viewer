import { useState } from "react";
import Card from "../UI/Card";

export default function LoginForm(props) {
  const [enteredUsername, setEnteredUsername] = useState("");

  async function newUserHandler(event) {
    event.preventDefault();
    await props.makeNewUser(enteredUsername);
    console.log("attempted to make a new user")
    setEnteredUsername("");
  }

  async function loginHandler(event) {
    event.preventDefault();
    props.tryLogin(enteredUsername);
    setEnteredUsername("");
  }

  return (
    <Card>
      <form>
        <div>
          <label>Username:</label>
        </div>
        <input type="text" value={enteredUsername} placeholder="Enter username here" onChange={(event) => {
            setEnteredUsername(event.target.value);
        }}>
        </input>
        <div>
          <button onClick={newUserHandler}>Make new user</button>
          <button onClick={loginHandler}>Get existing team</button>
        </div>
      </form>
    </Card>
  );
}
