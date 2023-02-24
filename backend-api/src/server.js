import Express from "express";
import PokemonDatabase from "./users.js";


const db = await PokemonDatabase.fromFile('./src/db/pokemon-teams.sqlite');

const app = Express();

const port = process.env.PORT || 8080;

app.use(Express.json());

// Attempts to create a new user with the given name and password
app.post("/user", async (req, res) => {
  try {
    db.addUser(req.body.username, req.body.password);
    res.send();
  } catch (e) {
    res.status(400).send(`Username already exists`);
  }
});

// Attempts to update a user's password
app.put("/user", async (req, res) => {
  try {
    db.changePassword(req.body.user, req.body.oldPassword, req.body.newPassword);
  } catch (e) {
    res.status(403).send();
  }
});

// Attempts to remove a given user
app.delete("/user", async (req, res) => {
  try {
    db.removeUser(req.body.user, req.body.password);
  } catch (e) {
    res.status(403).send();
  }
})

// Create a new team with the given name
app.post("/team/:user/:teamName", (req, res) => {
  db.addTeam(req.params.user, req.params.teamName);
});

// Gets the team for a specific username and team name
app.get("/team/:user/:teamName", async (req, res) => {
  console.log(`getting team '${req.params.teamName}' from '${req.params.user}'`);
  try {
    const team = await db.getTeam(req.params.user, req.params.teamName);
    console.log(team);
    res.send(team);
  } catch (e) {
    console.log(e);
    res.status(400).send(`Username ${req.params.user} or Team ${req.params.teamName} does not exist`);
  }
});

// remove a team from a given user
app.delete("/team/:user/:teamName", async (req, res) => {
  try {
    db.removeTeam(req.params.user, req.params.teamName);
  } catch (e) {
    console.log(e);
    res.status(400).send(`Username ${req.params.user} does not have a team ${req.params.teamName}`)
  }
});

// Get the list of teams for a specific username
app.get("/teams/:user", async (req, res) => {
  try {
    const teamList = await db.getUserTeams(req.params.user);
    console.log(teamList);
    res.send(teamList);
  } catch (e) {
    console.log(e);
    res.status(400).send(`Username ${req.params.user} does not exist`);
  }
});

// Adds a new Pokemon with the given pokemon name and nickname to the given team
app.post("/pokemon/:user/:teamName", async (req, res) => {
  try {
    const pID = await db.addPokemon(req.params.user, req.params.teamName, req.body)
    res.send(pID);
  } catch (e) {
    res.status(400).send(`Username ${req.params.user} or Team ${req.params.teamName} does not exist`);
  }
});

// Updates the pokemon with the given ID on the given team
app.put("/pokemon/:user/:teamName:", async (req, res) => {
  try {
    await db.updatePokemon(req.params.user, req.params.teamName, req.body);
  } catch (e) {
    res.status(400).send(`Invalid Inputs`);
  }
});

// Removes a Pokemon with the given ID from the database
app.delete("/pokemon/:user/:pokemonID", async (req, res) => {
  try {
    await db.removePokemonByID(req.params.pokemonID);
  } catch (e) {
    res.status(400).send(`Invalid Pokemon ID: ${req.params.pokemonID}`)
  }
});


app.listen(port, () => {
  console.log(`listening on port ${port}`);
});