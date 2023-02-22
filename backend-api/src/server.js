import Express from "express";
import * as users from "./users.js";

const app = Express();

const port = process.env.PORT || 8080;

app.use(Express.json());

// Gets the team for a specific username
app.get("/team/:id", (req, res) => {
  console.log(`getting team from ${req.params.id}`);
  try {
    const team = users.getTeam(req.params.id);
    console.log(team);
    res.send(team);
  } catch (e) {
    res.status(400).send(`Username ${req.params.id} does not exist`);
  }
});

// Updates the team for a specific username
app.put("/teams", (req, res) => {
  console.log("update request received");

  try {
    users.updateUser(req.body.name, req.body.team, req.body.numAdded);
    res.send("updated team");
  } catch (e) {
    console.log("could not find user")
    res.status(400).send(`Username ${req.body.name} does not exist`);
  }
});

// Attempts to create a new user with the given name
app.post("/users/:id", (req, res) => {
  const success = users.addUser(req.params.id);
  console.log(`requested to make new user ${req.params.id}, resulting in ${success}`);
  res.send(success);
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
