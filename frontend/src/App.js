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
  const [userInfo, setUserInfo] = useState({});
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
      const text = await response.text();
      console.log(text);
      if (text === "true") {
        console.log("login success");
        setUserInfo(user);
        setIsLoggedIn(true);

        const teamResponse = await fetch(`/teams/${user.username}`);
        const teamList = await teamResponse.json();
        setUserTeams(teamList.map(eachTeam => eachTeam.teamName));
      }
    } catch (e) {
      console.log(e);
      return;
    }
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
    try {
      await fetch(`/team/${userInfo.username}/${teamName}`, {
        method: "POST",
        body: JSON.stringify(userInfo),
        headers: { "Content-Type": "application/json" },
      });
      setUserTeams(prev => [...prev, teamName]);
      await loadTeam(teamName);
    } catch (e) {
      console.log("Could not create team - Error: " + e);
    }
  }

  async function loadTeam(teamName) {
    try {
      const response = await fetch(`/team/${userInfo.username}/${teamName}`);
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
      await fetch(`team/${userInfo.username}/${teamName}`, {
        method: "DELETE",
        body: JSON.stringify(userInfo),
        headers: { "Content-Type": "application/json" },
      });

      setUserTeams(prev => prev.filter(eachTeam => eachTeam.teamName !== teamName));
      setHasTeam(false);
      setTeam([]);
      setTeamName("");
    } catch (e) {
      return;
    }
  }

  async function addPokemon(pokemonName) {
    const request = {
      userInfo: userInfo,
      pokemon: {
        name: pokemonName,
        nickname: pokemonName,
      },
    };
    try {
      const apiData = await pokeAPIData(pokemonName);
      const response = await fetch(`/pokemon/${userInfo.username}/${teamName}`, {
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
    await fetch(`/pokemon/${userInfo.username}/${pokemonID}`, {
      method: "DELETE",
      body: JSON.stringify(userInfo),
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
        <Card className = "login-form">
          <h>Team List:</h>
          {userTeams.map((teamName) => (
            <div key = {teamName}>"{teamName}"</div>
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
