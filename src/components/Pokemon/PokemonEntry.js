import Card from "../UI/Card";

function PokemonEntry(props) {
  function deleteHandler() {
    console.log(props.id);
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
        <img src = {props.pokemon.sprite} width = {100} height = {100} alt = ''/>
      </Card>
      
    </li>
  );
}

export default PokemonEntry;
