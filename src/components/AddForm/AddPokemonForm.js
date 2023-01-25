import { useState } from "react";
import {Pokedex} from 'pokeapi-js-wrapper';

function AddPokemonForm(props) {
  const [enteredPokemon, setEnteredPokemon] = useState("Pikachu");

  async function addHandler(event) {
    event.preventDefault();
    findPokemon(enteredPokemon).then((response) => {
      setEnteredPokemon("");
      if (response) {
        props.addPokemon(response);
      }
      console.log(response);
    }, () => {});
  }

  function pokemonInputHandler(event) {
    setEnteredPokemon(event.target.value);
  }

  return (
    <form>
      <label>Pokemon Name or Pokedex Number</label>
      <input type="text" value={enteredPokemon} onChange={pokemonInputHandler} />
      <button onClick={addHandler}>Add Pokemon</button>
    </form>
  );
}

async function findPokemon(pokemonName) {
  const P = new Pokedex();

  const findTarget = async () => await P.getPokemonByName(pokemonName.toLowerCase())    
  const target = findTarget(pokemonName);
  return target;
}

export default AddPokemonForm;
