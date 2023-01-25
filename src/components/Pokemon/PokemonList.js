import PokemonEntry from "./PokemonEntry";
import Card from "../UI/Card"

function PokemonList(props) {
  if (props.team.length === 0) {
    return <div>No pokemon currently on team</div>;
  }

  return (
    <ul>
      {props.team.map((pokemon) => (
        <PokemonEntry id={pokemon.id} pokemon={pokemon} onDelete={props.onDelete}/>
      ))}
    </ul>
  );
}

export default PokemonList;
