import './PokemonTeamViewer.css';

import Card from "../UI/Card";

import AddPokemonForm from "../Forms/AddPokemonForm";
import PokemonList from "./PokemonList";

import { useState } from "react";

export default function PokemonTeamViewer(props) {
  const [pokemonTeam, setPokemonTeam] = useState([]);
  const [numPokeAdded, setNumPokeAdded] = useState(0);

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

  return (
    <div className="Pokemon-Team-Viewer">
      {pokemonTeam.length < 6 && <AddPokemonForm addPokemon={addPokemonToTeam}></AddPokemonForm>}
      <Card id="team-list">
        <PokemonList team={pokemonTeam} onDelete={deletePokemonFromTeam}></PokemonList>
      </Card>
    </div>
  );
}
