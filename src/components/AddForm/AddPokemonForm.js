import { useState } from "react";
import {Pokedex} from 'pokeapi-js-wrapper';

import './AddPokemonForm.css'

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
      <div>
        <label>Pokemon Name or Pokedex Number</label>
      </div>
      <input type="text" value={enteredPokemon} onChange={pokemonInputHandler} />
      <div>
        <button onClick={addHandler}>Add Pokemon</button>
      </div>
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
