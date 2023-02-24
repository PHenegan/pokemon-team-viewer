import sqlite3 from "sqlite3";
import { open } from "sqlite";

export default class PokemonDatabase {
  constructor(db) {
    this.db = db;
  }

  static async fromFile(filename) {
    const db = open({
      filename: filename,
      driver: sqlite3.Database,
    });
    return new PokemonDatabase(await db);
  }

  /**
   * Adds a new user with the given team to the list
   *
   * @param {string} username - the username of the user being created
   * @param {string} password - the (hopefully hashed) password of the user being created
   */
  async addUser(username, password) {
    try {
      await this.db.run(
        `INSERT INTO Users (username, password) VALUES ('${username}', '${password}');`
      );
    } catch (e) {
      throw new Error(`username ${username} already exists`);
    }
  }

  /**
   * Updates the user's password to the new password
   *
   * @param {string} username
   * @param {string} oldPassword
   * @param {string} newPassword
   */
  async changePassword(username, oldPassword, newPassword) {
    await this.db.run(
      `UPDATE Users SET password = '${newPassword}' ` +
        `WHERE username = '${username}' AND password = '${oldPassword}';`
    );
  }

  /**
   * Verifies that there is a user with the given username and password
   *
   * @param {string} username the username to authenticate
   * @param {string} password the password being checked
   * @returns true if the verification is successful, false otherwise
   */
  async authenticateUser(username, password) {
    const user = await this.db.get(
      `SELECT * FROM Users WHERE username = '${username}' AND password = '${password}';`
    );
    return user !== undefined;
  }

  /**
   * Gets all of the teams from the given user
   * @param {string} username - the name of the user being accessed
   * @returns a list of teams and their ids
   */
  async getUserTeams(username) {
    const teams = await this.db.all(
      `SELECT teamName FROM Users ` +
        `JOIN Teams ON Users.username = Teams.userID ` +
        `WHERE username = '${username}';`
    );
    console.log(teams);
    return teams;
  }

  /**
   * Adds a new team under the given user with the given name
   * @param {string} username
   * @param {string} teamName
   */
  async addTeam(username, teamName) {
    try {
      await this.db.run(
        `INSERT INTO Teams (userID, teamName) VALUES ('${username}', '${teamName}');`
      );
    } catch (e) {
      throw new Error("Team with name already exists");
    }
  }

  /**
   * Finds the team from a given username and team name
   * @param {string} username
   * @returns the array of objects representing a team
   */
  async getTeam(username, teamName) {
    const teamID = await findTeamIDByName(this.db, username, teamName);

    const statement =
      `SELECT name, nickname, pokemonID ` +
      `FROM Pokemon JOIN Teams ON Pokemon.teamID = Teams.teamID ` +
      `WHERE userID = '${username}' AND teamName = '${teamName}' ` +
      `ORDER BY pokemonID`;
    const team = await this.db.all(statement);
    return team;
  }
  /**
   * Removes the team and all pokemon in the user's given team from the database
   * @param {string} username the name of the user removing a team
   * @param {string} teamName the name of the team to remove
   */
  async removeTeam(username, teamName) {
    const teamID = await findTeamIDByName(this.db, username, teamName);
    this.db.run(`DELETE FROM Pokemon WHERE teamID = ${teamID}`);
    this.db.run(`DELETE FROM Teams WHERE teamID = ${teamID}`);
  }

  /**
   * Adds the given pokemon to the database under the given team from the given user
   *
   * @param {string} username the user adding the pokemon
   * @param {string} teamName the team the pokemon is being added to
   * @param {object} pokemon the object representing the pokemon
   * @returns the id of the newly created pokemon
   */
  async addPokemon(username, teamName, pokemon) {
    const teamID = await findTeamIDByName(this.db, username, teamName);
    await this.db.run(
      `INSERT INTO Pokemon (teamID, name, nickname) VALUES (${teamID}, '${pokemon.name}', '${pokemon.nickname}');`
    );
    const row = await this.db.get("SELECT LAST_INSERT_ROWID() AS id;");
    return row.id;
  }

  async updatePokemon(username, teamName, pokemon) {
    const teamID = await findTeamIDByName(this.db, username, teamName);
    await this.db.run(
      `UPDATE Pokemon SET name='${pokemon.name}', nickname='${pokemon.nickname}' ` +
        `WHERE teamName = '${teamID}' AND pokemonID = ${pokemon.id};`
    );
  }

  /**
   * removes the pokemon with the given ID
   * @param {number} pokemonID
   */
  async removePokemonByID(pokemonID) {
    this.db.run(`DELETE FROM Pokemon WHERE pokemonID = ${pokemonID};`);
  }
}

/**
 * Tries to find the ID of a team with the given name from the given user
 *
 * @param {string} username - the username of the user being created
 * @param {string} teamName - the password to compare against the database
 */
async function findTeamIDByName(db, username, teamName) {
  const row = await db.get(
    `SELECT teamID FROM Teams WHERE userID = '${username}' AND teamName = '${teamName}';`
  );

  if (!row) {
    throw new Error(`Could not find team with name ${teamName} under ${username}`);
  }
  return row.teamID;
}
