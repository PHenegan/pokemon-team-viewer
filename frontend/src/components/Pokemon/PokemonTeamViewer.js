import './PokemonTeamViewer.css';

import Card from "../UI/Card";

import AddPokemonForm from "../Forms/AddPokemonForm";
import PokemonList from "./PokemonList";

import { useState } from "react";

export default function PokemonTeamViewer(props) {
  const [pokemonTeam, setPokemonTeam] = useState(props.userTeam);
  const [numPokeAdded, setNumPokeAdded] = useState(props.startingID);

  function deletePokemonFromTeam(id) {
    console.log("got to App.js");
    setPokemonTeam((prev) => prev.filter((pokemon) => pokemon.id !== id));
  }

  function addPokemonToTeam(pokemon, species) {
    if (pokemonTeam.length >= 6) {
      return;
    }

    setNumPokeAdded((prev) => prev + 1);

    const pokemonElt = {
      name: pokemon.name,
      types: pokemon.types,
      dexNum: species,
      sprite: pokemon.sprites.front_default,
      id: numPokeAdded,
    };
    console.log(numPokeAdded);
    setPokemonTeam((prevTeam) => [pokemonElt, ...prevTeam]);
  }

  function submitHandler(event) {
    event.preventDefault();
    props.updateTeam(pokemonTeam, numPokeAdded);
  }

  return (
    <div className="Pokemon-Team-Viewer">
      {pokemonTeam.length < 6 && <AddPokemonForm addPokemon={addPokemonToTeam}></AddPokemonForm>}
      <Card id="team-list">
        <PokemonList team={pokemonTeam} onDelete={deletePokemonFromTeam}></PokemonList>
      </Card>
      <Card><button onClick = {submitHandler}>Submit Team</button></Card>
    </div>
  );
}
