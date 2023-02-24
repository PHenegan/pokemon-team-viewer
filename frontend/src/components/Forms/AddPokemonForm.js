import { useState } from "react";
import { Pokedex } from "pokeapi-js-wrapper";
import Card from "../UI/Card";

import "./AddPokemonForm.css";

function AddPokemonForm(props) {
  const [enteredPokemon, setEnteredPokemon] = useState("Pikachu");
  
  async function addHandler(event) {
    event.preventDefault();
    try {
      await props.addPokemon(enteredPokemon.toLowerCase());
      resetForm();
    } catch(error){
      console.log("Could not find Pokemon.")
    }
  }

  function pokemonInputHandler(event) {
    setEnteredPokemon(event.target.value);
  }

  function resetForm() {
    setEnteredPokemon("");
  }

  return (
    <Card className="pokemon-form-list">
      <form>
        <div>
          <label>Pokemon Name or Pokedex Number</label>
        </div>
        <input type="text" value={enteredPokemon} onChange={pokemonInputHandler} />
        <div>
          <button className="pokemon-form-list__submit" onClick={addHandler}>
            Add Pokemon
          </button>
        </div>
      </form>
    </Card>
  );
}

export default AddPokemonForm;
