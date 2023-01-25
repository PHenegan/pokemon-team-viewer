import PokemonEntry from "./PokemonEntry";

function PokemonList(props) {
  if (props.team.length === 0) {
    return <div>No pokemon currently on team</div>;
  }

  return (
    <ul>
      {props.team.map((pokemon) => (
        <PokemonEntry key={pokemon.id} id={pokemon.id} pokemon={pokemon} onDelete={props.onDelete} />
      ))}
    </ul>
  );
}

export default PokemonList;
