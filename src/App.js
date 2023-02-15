import "./App.css";
import Card from "./components/UI/Card";
import PokemonTeamViewer from "./components/Pokemon/PokemonTeamViewer";

function App() {
  return (
    <Card style={{maxWidth: '95%', verticalAlign:'center'}}>
      <h1 id="title" style={{alignText:'center'}}>Pokemon Team Creator</h1>
      <PokemonTeamViewer id="viewer"></PokemonTeamViewer>
    </Card>
  );
}

export default App;