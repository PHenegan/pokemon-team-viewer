import logo from "./logo.svg";
import "./App.css";
import AddPokemonForm from "./components/AddForm/AddPokemonForm";
import Card from "./components/UI/Card";
import { useState } from "react";
import PokemonList from "./components/Pokemon/PokemonList";

function App() {
  const [pokemonTeam, setPokemonTeam] = useState([]);
  const [numPokeAdded, setNumPokeAdded] = useState(0);

  function deletePokemonFromTeam(id) {
    console.log('got to App.js')
    setPokemonTeam(prev => prev.filter(pokemon => pokemon.id !== id));
  }

  function addPokemonToTeam(pokemon) {
    if (pokemonTeam.length >= 6) {
      return;
    }

    setNumPokeAdded((prev) => prev + 1);

    const pokemonElt = {
      name: pokemon.name,
      types: pokemon.types,
      dexNum: pokemon.id,
      sprite: pokemon.sprites.front_default,
      id: numPokeAdded,
    }
    console.log(numPokeAdded);
    setPokemonTeam(prevTeam => [pokemonElt, ...prevTeam]);
  }

  return (
    <div>
      <h1>Pokemon Team Creator</h1>
      <Card>
        <AddPokemonForm addPokemon = {addPokemonToTeam}></AddPokemonForm>
      </Card>
      <Card>
        <PokemonList team = {pokemonTeam} onDelete = {deletePokemonFromTeam}></PokemonList>
      </Card>
    </div>
  );
}

export default App;