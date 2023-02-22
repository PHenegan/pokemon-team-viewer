import "./App.css";
import Card from "./components/UI/Card";
import PokemonTeamViewer from "./components/Pokemon/PokemonTeamViewer";
import LoginForm from "./components/Forms/LoginForm";
import { useState } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  async function login(username) {
    try {
      const user = await (await fetch(`/team/${username}`)).json();
      console.log(user);
      setUser(user);
    } catch {
      return;
    }

    setIsLoggedIn(true);
  }

  async function createUser(username) {
    if (username === "") {
      return;
    }

    const loginResult = await (await fetch(`/users/${username}`, { method: "POST" })).text();
    if (loginResult) {
      login(username);
    }
  }

  async function submitTeam(team, numAdded) {
    const updatedUser = {
      name: user.name,
      team: team,
      numAdded: numAdded,
    };
    try {
      console.log(updatedUser);
      console.log(JSON.stringify(updatedUser));
      await fetch(`/teams`, {
        method: "PUT",
        body: JSON.stringify(updatedUser),
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      return;
    }
  }

  return (
    <Card style={{ maxWidth: "95%", verticalAlign: "center" }}>
      <h1 id="title" style={{ alignText: "center" }}>
        Pokemon Team Creator
      </h1>
      {!isLoggedIn && <LoginForm tryLogin={login} makeNewUser={createUser}></LoginForm>}
      {isLoggedIn && (
        <PokemonTeamViewer
          id="viewer"
          startingID={user.numAdded}
          userTeam={user.team}
          updateTeam={submitTeam}
        />
      )}
    </Card>
  );
}

export default App;
