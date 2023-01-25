import Card from "../UI/Card";
import "./PokemonEntry.css";

function PokemonEntry(props) {
  function deleteHandler() {
    props.onDelete(props.id);
  }

  const name = props.pokemon.name.charAt(0).toUpperCase() + props.pokemon.name.substring(1);
  console.log(props.pokemon.sprite);
  return (
    <li onClick={deleteHandler}>
      <Card>
        <div>{name}</div>
        <div>Pokemon #{props.pokemon.dexNum}</div>
        {/* <PokemonTypesList></PokemonTypesList> */}
        <img className="PokemonEntry" src={props.pokemon.sprite} alt="" />
      </Card>
    </li>
  );
}

export default PokemonEntry;
