import PokemonEntry from "./PokemonEntry";
import "./PokemonList.css";
import Card from "../UI/Card";

function PokemonList(props) {
  if (props.team.length === 0) {
    return <Card>No pokemon currently on team</Card>;
  }

  return (
      <ul className="pokemon-list">
        {props.team.map((pokemon) => (
          <PokemonEntry
            key={pokemon.id}
            id={pokemon.id}
            pokemon={pokemon}
            onDelete={props.onDelete}
          />
        ))}
      </ul>
  );
}

export default PokemonList;
