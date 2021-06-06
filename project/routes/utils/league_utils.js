const axios = require("axios");
const DButils = require("./DButils");
const LEAGUE_ID = 271;

async function getLeagueDetails() {
  const league = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/leagues/${LEAGUE_ID}`,
    {
      params: {
        include: "season",
        api_token: process.env.api_token,
      },
    }
  );
  let stageans;
  if (league.data.data.current_stage_id != null) {
    const stage = await axios.get(
      `https://soccer.sportmonks.com/api/v2.0/stages/${league.data.data.current_stage_id}`,
      {
        params: {
          api_token: process.env.api_token,
        },
      }
    );
    stageans = stage.data.data.name;
  } else {
    stageans = "There is no current stage";
  }
  return {
    league_name: league.data.data.name,
    current_season_name: league.data.data.season.data.name,
    current_stage_name: stageans,
  };
}

async function addMatch(date, time, hometeam, awayteam, stadium) {
  await DButils.execQuery(
    `INSERT INTO dbo.matches (date, time, hometeam, awayteam, stadium) VALUES ('${date}','${time}','${hometeam}','${awayteam}', '${stadium}')`
  );
}

async function addEvent(match_id, date, time, gamemin, event) {
  await DButils.execQuery(
    `INSERT INTO dbo.eventbook (match_id, date, time, gamemin, event) VALUES ('${match_id}','${date}','${time}','${gamemin}','${event}')`
  );
}

async function addResult(match_id, result) {
  await DButils.execQuery(
    `UPDATE dbo.matches SET result = '${result}' WHERE match_id = '${match_id}'`
  );
}

async function addReferee(referee_id, match_id) {
  const permission = await DButils.execQuery(
    `SELECT permission FROM users WHERE user_id = '${referee_id}'`
  );
  if (permission[0]["permission"] == 2) {
    await DButils.execQuery(
      `UPDATE dbo.matches SET referee = '${referee_id}' WHERE match_id = '${match_id}'`
    );
    return "Referee updated";
  } else {
    return "The user is not a referee";
  }
}

async function setPermission(user_id, permission) {
  await DButils.execQuery(
    `UPDATE dbo.users SET permission = '${permission}' WHERE user_id = '${user_id}'`
  );
}

async function getAllMatches() {
  const matches = await DButils.execQuery(`SELECT * FROM matches`);
  let res = GamesData(matches);
  return res;
}

function GamesData(matches) {
  return matches.map((game) => {
    const { date, time, hometeam, awayteam, stadium } = game;

    return {
      date: date,
      time: time,
      hometeam: hometeam,
      awayteam: awayteam,
      stadium: stadium,
    };
  });
}

exports.getLeagueDetails = getLeagueDetails;
exports.addReferee = addReferee;
exports.addEvent = addEvent;
exports.addMatch = addMatch;
exports.addResult = addResult;
exports.setPermission = setPermission;
exports.getAllMatches = getAllMatches;
