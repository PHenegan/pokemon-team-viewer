import Card from "../UI/Card";
import "./PokemonEntry.css";

function PokemonEntry(props) {
  function deleteHandler() {
    props.onDelete(props.id);
  }

  const name = props.pokemon.name.charAt(0).toUpperCase() + props.pokemon.name.substring(1);
  console.log(props.pokemon.sprite);
  return (
    <div className = "pokemon-entry" onClick={deleteHandler}>
      <Card>
        <div>{name}</div>
        <div>Pokemon #{props.pokemon.dexNum}</div>
        {/* <PokemonTypesList></PokemonTypesList> */}
        <img src={props.pokemon.sprite} alt="" />
      </Card>
    </div>
  );
}

export default PokemonEntry;
