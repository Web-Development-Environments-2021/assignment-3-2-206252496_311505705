// const axios = require("axios");
// const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const DButils = require("../utils/DButils");
const team_utils = require("../utils/team_utils");

async function getMatchDetails(match_id) {
  let match = await DButils.execQuery(
    `select * from dbo.Matches where match_id='${match_id}'`
  );
  if (match.length === 0) return {};
  match = match[0];
  team_ids = [match.home_team, match.away_team];
  let teams = [];
  team_ids.map((id) => teams.push(team_utils.getTeamDetailsById(id)));
  let teams_info = await Promise.all(teams);
  let home_g = null;
  let away_g = null;
  if (!isUpcomingMatch(match.date)) {
    home_g = match.home_goal;
    away_g = match.away_goal;
  }
  let match_events = await getMatchEvents(match_id);

  result = {
    // match_id: match.match_id,
    date: match.date,
    hour: match.hour,
    home_team: teams_info[0].data.data,
    away_team: teams_info[1].data.data,
    stadium: match.stadium,
    home_goal: home_g,
    away_goal: away_g,
    referee_id: match.referee_id,
    events: match_events,
  };
}

async function getMatchEvents(match_id) {
  let events = await DButils.execQuery(
    `select * from dbo.Events where match_id='${match_id}'`
  );
  let result = [];
  events.map((event_object) =>
    result.push({
      date: event_object.date,
      hour: event_object.hour,
      minute: event_object.minute,
      action: event_object.action,
    })
  );
  return result;
}

async function getMatchIdsByTeam(team_id) {
  let match_ids_list = [];
  match_ids_list = await DButils.execQuery(
    `select match_id from dbo.Matches where home_team='${team_id}' or away_team='${team_id}'`
  );
  let results = [];
  match_ids_list.map((tuple) => results.push(tuple));
  return results;
}

async function getMatchesInfo(match_ids_list) {
  let promises = [];
  match_ids_list.map((id) => promises.push(getMatchDetails(id.match_id)));
  let matches_info = await Promise.all(promises);
  return matches_info;
}
async function getAllUpcomingMatches() {
  let all_matches = await DButils.execQuery(
    `select match_id, date from dbo.Matches order by convert(datetime,date,105)`
  );
  let relevant_matches = [];
  all_matches.map((tuple) => {
    if (isUpcomingMatch(tuple.date)) {
      relevant_matches.push(tuple);
    }
  });
  matches_info = await getMatchesInfo(relevant_matches);
  return matches_info;
}

function isUpcomingMatch(date) {
  let current_date = new Date();
  let checked_date = date.split("-");
  //checks year
  current_year = current_date.getFullYear(0);
  if (current_year != checked_date[2]) {
    return current_year < checked_date[2];
  }
  current_month = current_date.getMonth() + 1;
  if (current_month != checked_date[1]) {
    return current_month < checked_date[1];
  }
  current_day = current_date.getDate();
  if (current_day != checked_date[0]) {
    return current_day < checked_date[0];
  }
  return false;
}
// function extractRelevantMatchData(matches_info) {
//     return matches_info.map((match_info) => {
//         //TODO: need to implement as match
//         const { home_team_id, away_team_id, date, field } = player_info.data.data;
//         const { name } = player_info.data.data.team.data;
//         return {
//             name: fullname,
//             image: image_path,
//             position: position_id,
//             team_name: name,
//         };
//     });
// }

async function getMatchesByTeam(team_id) {
  let match_ids_list = await getMatchIdsByTeam(team_id);
  let matches_info = await getMatchesInfo(match_ids_list);
  return matches_info;
}

exports.getMatchesByTeam = getMatchesByTeam;
exports.getMatchesInfo = getMatchesInfo;
exports.getAllUpcomingMatches = getAllUpcomingMatches;
exports.getMatchDetails = getMatchDetails;
