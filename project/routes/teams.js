var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
const teams_utils = require("./utils/teams_utils");
const matches_utils = require("./utils/matches_utils");

// TEAM PAGE
router.get("/teamFullDetails/:teamId", async (req, res, next) => {
  try {
    const team_matches = await teams_utils.getTeamMatches(req.params.teamId);
    let match_ids_array = [];
    team_matches.map((element) => match_ids_array.push(element.match_id));
    // get future + past data => result[0]=future, result[1]=past_ids
    const results = await matches_utils.getTeamGames(match_ids_array);
    let allPastGames = [];
    // get past games
    results[1].map((id) =>
      allPastGames.push(matches_utils.extractPastGamesData(id))
    );
    let past_games = await Promise.all(allPastGames);
    let future_games = results[0];
    // get all players
    const players_details = await players_utils.getPlayersByTeam(
      req.params.teamId
    );
    result = {
      players: players_details,
      past_games: past_games,
      future_games: future_games,
    };
    res.send(result);
  } catch (error) {
    next(error);
  }
});

router.get("/searchTeam/:teamName", async (req, res, next) => {
  try {
    const team_info = await teams_utils.getTeamDetails(req.params.teamName);
    res.send(team_info);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
