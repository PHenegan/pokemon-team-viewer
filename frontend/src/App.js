import "./App.css";
import Card from "./components/UI/Card";
import PokemonTeamViewer from "./components/Pokemon/PokemonTeamViewer";
import LoginForm from "./components/Forms/LoginForm";
import { useState } from "react";
import TeamForm from "./components/Forms/TeamForm";

import { Pokedex } from "pokeapi-js-wrapper";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasTeam, setHasTeam] = useState(false);
  const [username, setUsername] = useState({});
  const [userTeams, setUserTeams] = useState([]);
  const [team, setTeam] = useState([]);
  const [teamName, setTeamName] = useState("");

  async function login(username, password) {
    const user = {
      username: username,
      password: password,
    };
    console.log("attempting to sign in");
    try {
      const response = await fetch(`/login`, {
        method: "PUT",
        body: JSON.stringify(user),
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        console.log("login success");
        setUsername(username);
        setIsLoggedIn(true);

        const teamResponse = await fetch(`/teams/${user.username}`);
        const teamList = await teamResponse.json();
        setUserTeams(teamList.map((eachTeam) => eachTeam.teamName));
      } else {
        return;
      }
    } catch (e) {
      console.log(e);
      return;
    }
  }

  function logout() {
    setHasTeam(false);
    setTeamName("");
    setTeam([]);
    setUserTeams([]);
    setUsername("");
    setIsLoggedIn(false);
  }

  async function createUser(username, password) {
    if (!username || !password || username === "" || password === "") {
      return;
    }
    const user = {
      username: username,
      password: password,
    };

    try {
      await fetch("/user", {
        method: "POST",
        body: JSON.stringify(user),
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      console.log("Could not make user");
      return;
    }

    login(username, password);
  }

  async function addTeam(teamName) {
    // Team name should not be accepted if it is empty or undefined
    if (!teamName || teamName === "") {
      return;
    }
    const result = await fetch(`/team/${username}/${teamName}`, {
      method: "POST",
    });

    if (result.status === 403) {
      logout();
    } else if (result.status === 200) {
      setUserTeams((prev) => [...prev, teamName]);
      await loadTeam(teamName);
    }
  }

  async function loadTeam(teamName) {
    try {
      const response = await fetch(`/team/${username}/${teamName}`);
      const teamData = await response.json();
      const teamObjects = await Promise.all(
        teamData.map((eachPokemon) => pokemonFromDatabase(eachPokemon))
      );
      console.log(teamObjects);

      setTeam(teamObjects);
      setTeamName(teamName);
      setHasTeam(true);
    } catch (e) {
      console.log(`Could not find team - Error: ${e}`);
    }
  }

  async function deleteTeam() {
    console.log(`attempting to delete team ${teamName}`);

    try {
      await fetch(`team/${username}/${teamName}`, {
        method: "DELETE",
      });

      setUserTeams((prev) => prev.filter((eachTeam) => eachTeam.teamName !== teamName));
      setHasTeam(false);
      setTeam([]);
      setTeamName("");
    } catch (e) {
      return;
    }
  }

  async function addPokemon(pokemonName) {
    const request = {
      name: pokemonName,
      nickname: pokemonName,
    };
    try {
      const apiData = await pokeAPIData(pokemonName);
      const response = await fetch(`/pokemon/${username}/${teamName}`, {
        method: "POST",
        body: JSON.stringify(request),
        headers: { "Content-Type": "application/json" },
      });
      const id = (await response.json()).id;

      const pokemonObject = {
        name: apiData.name,
        nickname: apiData.name,
        types: apiData.types,
        sprite: apiData.sprites.front_default,
        dexNum: apiData.dexNum,
        id: id,
      };

      setTeam((prev) => [...prev, pokemonObject]);
    } catch (e) {
      console.log(`Pokemon ${pokemonName} does not exist or could not be added to the team`);
      return;
    }
  }

  async function deletePokemon(pokemonID) {
    console.log(`attempting to delete pokemon with id ${pokemonID}`);
    const response = await fetch(`/pokemon/${username}/${pokemonID}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    setTeam((prev) => prev.filter((eachPokemon) => eachPokemon.id !== pokemonID));
  }

  let content = <></>;
  if (hasTeam && isLoggedIn) {
    content = (
      <PokemonTeamViewer
        id="viewer"
        team={team}
        teamName={teamName}
        addPokemon={addPokemon}
        deletePokemon={deletePokemon}
        deleteTeam={deleteTeam}
      />
    );
  } else if (isLoggedIn) {
    //content = <TeamForm makeTeam={addTeam} loadTeam={loadTeam} />;

    content = (
      <div>
        <Card className="login-form">
          <h3>Team List:</h3>
          {userTeams.map((teamName) => (
            <div key={teamName}>"{teamName}"</div>
          ))}
        </Card>
        <TeamForm makeTeam={addTeam} loadTeam={loadTeam} />
      </div>
    );
  } else {
    content = <LoginForm tryLogin={login} makeNewUser={createUser}></LoginForm>;
  }

  return (
    <Card style={{ maxWidth: "95%", verticalAlign: "center" }}>
      <h1 id="title" style={{ alignText: "center" }}>
        Pokemon Team Creator
      </h1>
      {content}
    </Card>
  );
}

async function pokeAPIData(pokemonName) {
  const P = new Pokedex();

  const pokemon = await P.getPokemonByName(pokemonName.toLowerCase());

  // The string in between the last 2 '/' characters should be the pokedex number of the species
  // Doing this minimizes the number of API calls needed, since I only want the dex number
  let speciesURL = pokemon.species.url;
  speciesURL = speciesURL.substring(0, speciesURL.length - 1);
  const dexNum = speciesURL.substring(speciesURL.lastIndexOf("/") + 1);
  pokemon.dexNum = dexNum;

  return pokemon;
}

async function pokemonFromDatabase(databaseEntry) {
  const pokemon = await pokeAPIData(databaseEntry.name);
  const pokemonObject = {
    name: databaseEntry.name,
    nickname: databaseEntry.nickname,
    types: pokemon.types,
    sprite: pokemon.sprites.front_default,
    dexNum: pokemon.dexNum,
    id: databaseEntry.pokemonID,
  };
  return pokemonObject;
}
