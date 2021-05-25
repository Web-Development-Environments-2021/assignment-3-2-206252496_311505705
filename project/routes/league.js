var express = require("express");
var router = express.Router();
const league_utils = require("./utils/league_utils");
const DButils = require("../routes/utils/DButils");
const { Time } = require("mssql");

router.get("/getDetails", async (req, res, next) => {
  try {
    const league_details = await league_utils.getLeagueDetails();
    res.send(league_details);
  } catch (error) {
    next(error);
  }
});

router.use("/addMatch", function(req, res, next) {
  DButils.execQuery("SELECT user_id FROM users")
  .then((users) => {

    if (users.find((x) => x.user_id === req.session.user_id)) {
          DButils.execQuery(`SELECT permission FROM users WHERE user_id = '${req.session.user_id}'`)
          .then((permission) => {
            if (permission[0]["permission"] != 3) {
              res.sendStatus(401)
            }
            else {next();}
            })
          .catch();
    }
  })
  .catch();
});


router.post("/addMatch", async (req, res, next) => {
  try {
    // add the new match
    await DButils.execQuery(
      `INSERT INTO dbo.matches (date, time, hometeam, awayteam, stadium, result, referee) VALUES ('${req.body.date}','${req.body.time}','${req.body.hometeam}','${req.body.awayteam}', '${req.body.stadium}','${req.body.result}','${req.body.referee}')`
    );
    res.status(201).send("Match created");
  } catch (error) {
    next(error);
  }
});

// get match_id from user ??
router.post("/addEvent", async (req, res, next) => {
  try {
    // add the new match
    await DButils.execQuery(
      `INSERT INTO dbo.eventbook (match_id, date, time, gamemin, event) VALUES ('${req.body.match_id}','${req.body.date}','${req.body.time}','${req.body.gamemin}','${req.body.event}')`
    );
    res.status(201).send("Event created");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
