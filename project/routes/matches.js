var express = require("express");
var router = express.Router();
const matches_utils = require("./utils/matches_utils");
const DButils = require("./utils/DButils");

router.get("/futureGames", async (req, res, next) => {
  try {
    const games = await matches_utils.getGamesDetails();
    res.send(games[0]);
  } catch (error) {
    next(error);
  }
});

router.get("/pastGames", async (req, res, next) => {
  let allPastGames = [];
  try {
    const games = await matches_utils.getGamesDetails();
    games[1].map((id) =>
      allPastGames.push(matches_utils.extractPastGamesData(id))
    );
    let games_info = await Promise.all(allPastGames);
    // console.log(games_info);
    res.send(games_info);
  } catch (error) {
    next(error);
  }
});

router.get("/nextGame", async (req, res, next) => {
  try {
    const games = await matches_utils.getGamesDetails();
    const next = await matches_utils.getNextGame(games[0]);
    res.send(next);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
