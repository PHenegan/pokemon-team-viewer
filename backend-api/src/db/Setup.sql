
-- Note: use bcrypt for hashing passwords
CREATE TABLE Users
(
    username    TEXT PRIMARY KEY,
    password    TEXT NOT NULL
);


CREATE TABLE Teams
(
    userID      TEXT NOT NULL,
    teamName    TEXT,
    teamID      INTEGER PRIMARY KEY,
    FOREIGN KEY (userID)
        REFERENCES Users (username)
        ON UPDATE CASCADE
);


CREATE TABLE Pokemon
(
    pokemonID   INTEGER PRIMARY KEY AUTOINCREMENT,
    teamID      INTEGER,
    name        TEXT NOT NULL,
    nickname    TEXT,
    FOREIGN KEY (teamID)
        REFERENCES Teams (teamID)
        ON UPDATE CASCADE
);