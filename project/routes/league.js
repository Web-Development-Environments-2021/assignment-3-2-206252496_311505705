var express = require("express");
var router = express.Router();
const league_utils = require("./utils/league_utils");
const matches_utils = require("./utils/matches_utils");
const DButils = require("../routes/utils/DButils");
const { Time } = require("mssql");

router.get("/getDetails", async (req, res, next) => {
  try {
    let league_details = await league_utils.getLeagueDetails();
    const games = await matches_utils.getFutureGames();
    const next = await matches_utils.getNextGame(games[0]);
    league_details = { ...league_details, nextgame: next };
    res.send(league_details);
  } catch (error) {
    next(error);
  }
});

// Checks user permission - Association Representative
router.use("/", function (req, res, next) {
  DButils.execQuery("SELECT user_id FROM users")
    .then((users) => {
      if (users.find((x) => x.user_id === req.session.user_id)) {
        DButils.execQuery(
          `SELECT permission FROM users WHERE user_id = '${req.session.user_id}'`
        )
          .then((permission) => {
            if (permission[0]["permission"] != 3) {
              res.sendStatus(401);
            } else {
              next();
            }
          })
          .catch();
      }
    })
    .catch();
});

router.post("/addMatch", async (req, res, next) => {
  try {
    // add the new match
    await league_utils.addMatch(
      req.body.date,
      req.body.time,
      req.body.hometeam,
      req.body.awayteam,
      req.body.stadium,
      req.body.result,
      req.body.referee
    );
    res.status(201).send("Match created");
  } catch (error) {
    next(error);
  }
});

router.post("/addEvent", async (req, res, next) => {
  try {
    // add the new event
    await league_utils.addEvent(
      req.body.match_id,
      req.body.date,
      req.body.time,
      req.body.gamemin,
      req.body.event
    );
    res.status(201).send("Event created");
  } catch (error) {
    next(error);
  }
});

router.post("/addResult", async (req, res, next) => {
  try {
    await league_utils.addResult(req.body.match_id, req.body.result);
    res.status(201).send("Result updated");
  } catch (error) {
    next(error);
  }
});

router.post("/addReferee", async (req, res, next) => {
  try {
    await league_utils.addReferee(req.body.referee_id, req.body.match_id);
    res.status(201).send("Referee updated");
  } catch (error) {
    next(error);
  }
});

router.post("/setPermission", async (req, res, next) => {
  try {
    await league_utils.setPermission(req.body.user_id, req.body.permission);
    res.status(201).send("Permission updated");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
