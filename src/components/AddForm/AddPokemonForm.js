import { useState } from "react";
import { Pokedex } from "pokeapi-js-wrapper";
import Card from "../UI/Card";

import "./AddPokemonForm.css";

function AddPokemonForm(props) {
  const [enteredPokemon, setEnteredPokemon] = useState("Pikachu");

  let pokemon;
  let species;

  async function findPokemon(pokemonName) {
    const P = new Pokedex();
  
    pokemon = await P.getPokemonByName(pokemonName.toLowerCase());
    
    // The string in between the last 2 '/' characters should be the pokedex number of the species
    // Doing this minimizes the number of API calls needed, since I only want the dex number
    let speciesURL = pokemon.species.url;
    speciesURL = speciesURL.substring(0, speciesURL.length - 1);
    species = speciesURL.substring(speciesURL.lastIndexOf('/') + 1);
    console.log(speciesURL);
    
  }
  
  async function addHandler(event) {
    event.preventDefault();
    try {
      await findPokemon(enteredPokemon);
      props.addPokemon(pokemon, species);
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
