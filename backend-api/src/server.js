import Express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import PokemonDatabase from "./PokemonDatabase.js";

const db = await PokemonDatabase.fromFile("./env/db/pokemon-teams.sqlite");
const SECRET = "adefinitelysecureandobviouslyperfectlyhiddensecretwhichyoucannotsee";

const app = Express();

const port = process.env.PORT || 8080;

// maximum cookie storage should be 5 minutes.
const maxAuthAge = 1000 * 60 * 1;
app.use(
  session({
    secret: SECRET,
    saveUninitialized: true,
    cookie: { maxAge: maxAuthAge },
    resave: false,
  })
);

app.use(Express.json());

// Attempts to create a new user with the given name and password
app.post("/user", async (req, res) => {
  try {
    const user = req.body.username;
    await db.addUser(user, req.body.password);

    const token = jwt.sign({ user: username }, SECRET, { expiresIn: maxAuthAge });
    res.send({ user: user, token });
  } catch (e) {
    res.status(400).send(`Username already exists`);
  }
});

// Attempts to update a user's password
app.put("/user", async (req, res) => {
  try {
    const authResult = await db.authenticateUser(req.body.username, req.body.password);
    if (!authResult) {
      res.status(403).send("Could not authenticate - username or password was incorrect");
      return;
zz
    }

    await db.changePassword(req.body.username, req.body.password, req.body.newPassword);
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

// Attempts to verify the credentials of a user
app.put("/login", async (req, res) => {
  const user = req.body.username;
  const password = req.body.password;
  try {
    const result = await db.authenticateUser(req.body.username, req.body.password);
    if (result) {
      req.session.user = req.body.username;
      req.session.authorized = true;
    }
    console.log(result);
    res.send(result);
  } catch (e) {
    res.status(400).send("User does not exist");
  }
});

app.get("/auth", async (req, res) => {
  if (req.session.authorized) {
    res.send(user);
  } else {
    res.status(400).send();
  }
});

// Create a new team with the given name
app.post("/team/:user/:teamName", async (req, res) => {
  try {
    const authResult = req.session.authorized;
    if (!authResult) {
      res.status(403).send();
      return;
    }

    await db.addTeam(req.params.user, req.params.teamName);
    res.send();
  } catch (e) {
    res.status(400).send(`Could not add team with name ${req.params.teamName}`);
  }
});

// Gets the team for a specific username and team name
app.get("/team/:user/:teamName", async (req, res) => {
  console.log(`getting team '${req.params.teamName}' from '${req.params.user}'`);
  try {
    const team = await db.getTeam(req.params.user, req.params.teamName);
    res.send(team);
  } catch (e) {
    res
      .status(400)
      .send(`Username ${req.params.user} or Team ${req.params.teamName} does not exist`);
  }
});

// remove a team from a given user
app.delete("/team/:user/:teamName", async (req, res) => {
  try {
    const authResult = req.session.authorized;
    if (!authResult) {
      res.status(403).send("Not signed in");
      return;
    }

    await db.removeTeam(req.params.user, req.params.teamName);
    res.send();
  } catch (e) {
    res.status(400).send(`Username ${req.params.user} does not have a team ${req.params.teamName}`);
  }
});

// Get the list of teams for a specific username
app.get("/teams/:user", async (req, res) => {
  try {
    console.log(req.params.user);
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
    const authResult = req.session.authorized;
    if (!authResult) {
      res.status(403).send("Not signed in");
      return;
    }
    const pID = await db.addPokemon(req.params.user, req.params.teamName, req.body.pokemon);
    res.send({ id: pID });
  } catch (e) {
    console.log(e);
    res
      .status(400)
      .send(`Username ${req.params.user} or Team ${req.params.teamName} does not exist`);
  }
});

// Updates the pokemon with the given ID on the given team
app.put("/pokemon/:user/:teamName:", async (req, res) => {
  try {
    const authResult = req.session.authorized;
    if (!authResult) {
      res.status(403).send("Not signed in");
      return;
    }
    if (!authResult) {
      res.status(403).send("Could not authenticate credentials");
      return;
    }
    await db.updatePokemon(req.params.user, req.params.teamName, req.body.pokemon);
    res.send();
  } catch (e) {
    res.status(400).send(`Invalid Inputs`);
  }
});

// Removes a Pokemon with the given ID from the database
app.delete("/pokemon/:user/:pokemonID", async (req, res) => {
  try {
    const authResult = req.session.authorized;
    if (!authResult) {
      res.status(403).send("Not signed in");
      return;
    }
    await db.removePokemonByID(req.params.pokemonID);
    res.send();
  } catch (e) {
    res.status(400).send(`Invalid Pokemon ID: ${req.params.pokemonID}`);
  }
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
