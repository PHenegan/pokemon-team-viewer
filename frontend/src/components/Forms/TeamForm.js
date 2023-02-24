import { useState } from "react";
import Card from "../UI/Card";

export default function TeamForm(props) {
  const [enteredTeamName, setEnteredTeamName] = useState("");

  async function newTeamHandler(event) {
    event.preventDefault();
    await props.makeTeam(enteredTeamName);
    setEnteredTeamName("");
  }

  async function existingTeamHandler(event) {
    event.preventDefault();
    await props.loadTeam(enteredTeamName);
    setEnteredTeamName("");
  }

  return (
    <Card className="login-form">
      <form>
        <div>
          <label>Team Name:</label>
        </div>
        <input
          type="text"
          value={enteredTeamName}
          placeholder="Enter team name here"
          onChange={(event) => {
            setEnteredTeamName(event.target.value);
          }}
        />
        <div>
          <button onClick={newTeamHandler}>Make new team</button>
          <button onClick={existingTeamHandler}>Load existing team</button>
        </div>
      </form>
    </Card>
  );
}
