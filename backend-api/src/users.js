const users = [];

/**
 * Adds the a new user with the given team to the list
 *
 * @param {string} username
 * @param {*} team
 */
export function addUser(username) {
  if (users.find(eachUser => eachUser.name === username)) {
    return false;
  }
  
    const newUser = {
    name: username,
    numAdded: 0,
    team: [],
  };

  users.push(newUser);
  return true;
}

/**
 * Updates the team of an existing user in the list
 *
 * @param {string} username
 * @param {*} team
 */
export function updateUser(username, team, numAdded) {
  const user = users.find((eachUser) => eachUser.name === username);
  if (!user) {
    throw new Error(`Unable to find user matching name ${username}`);
  }
  user.team = team;
  user.numAdded = numAdded;
}

/**
 * Finds the team (and all other user data) from a given username
 * @param {string} username 
 * @returns the array of objects representing a team
 */
export function getTeam(username) {
  const user = findUserInList(username);
  console.log(user);
  return user;
}

/**
 * Finds the user object given the user's name
 * @param {string} username 
 * @returns the user object corresponding to that username
 */
function findUserInList(username) {
  const user = users.find((eachUser) => eachUser.name === username);

  if (!user) {
    throw new Error(`Unable to find user matching name ${username}`);
  }

  return user;
}
