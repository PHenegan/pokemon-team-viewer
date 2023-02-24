import './PokemonTeamViewer.css';

import Card from "../UI/Card";

import AddPokemonForm from "../Forms/AddPokemonForm";
import PokemonList from "./PokemonList";


export default function PokemonTeamViewer(props) {
  async function deletePokemon(id) {
    await props.deletePokemon(id);
  }
  
  async function deleteTeamHandler(event) {
    await props.deleteTeam();
  }

  async function addHandler(pokemonName) {
    if (props.team.length >= 6) {
      return;
    }

    await props.addPokemon(pokemonName);
  }

  return (
    <div className="Pokemon-Team-Viewer">
      {props.team.length < 6 && <AddPokemonForm addPokemon={addHandler}></AddPokemonForm>}
      <Card id="team-list">
        <div>{props.teamName}</div>
        <PokemonList team={props.team} onDelete={deletePokemon}></PokemonList>
      </Card>
      <Card><button onClick = {deleteTeamHandler}>Delete Team</button></Card>
    </div>
  );
}
