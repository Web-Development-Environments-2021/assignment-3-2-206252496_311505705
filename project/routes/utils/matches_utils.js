const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const DButils = require("./DButils");

async function getTeamGames(matches_ids_array) {
  let promises = [];
  matches_ids_array.map((id) =>
    promises.push(
      DButils.execQuery(`SELECT * FROM dbo.matches WHERE match_id = '${id}'`)
    )
  );
  let favorite_info = await Promise.all(promises);
  let future = [];
  let past_ids = [];
  let today = new Date(); // Today date
  let hours = String(today.getHours()).padStart(2, "0");
  let minute = String(today.getMinutes()).padStart(2, "0");
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();
  favorite_info.map((temp) => {
    let date_list = temp[0]["date"].split("/"); // Date of curr match
    let dd2 = date_list[0];
    let mm2 = date_list[1];
    let yyyy2 = date_list[2];
    let time_list = temp[0]["time"].split(":"); // Time of curr match
    let hours2 = time_list[0];
    let minute2 = time_list[1];
    if (yyyy > yyyy2) {
      past_ids.push(temp[0]["match_id"]);
    } else if (yyyy == yyyy2) {
      if (mm > mm2) {
        past_ids.push(temp[0]["match_id"]);
      } else if (mm == mm2) {
        if (dd > dd2) {
          past_ids.push(temp[0]["match_id"]);
        } else if (dd == dd2) {
          // The same date
          if (hours > hours2) {
            past_ids.push(temp[0]["match_id"]);
          } else if (hours == hours2) {
            // The same hours
            if (minute > minute2) {
              past_ids.push(temp[0]["match_id"]);
            } else {
              future.push(temp);
            }
          } else {
            future.push(temp);
          }
        } else {
          future.push(temp);
        }
      } else {
        future.push(temp);
      }
    } else {
      future.push(temp);
    }
  });
  let future_info = await Promise.all(future);
  let Fres = extractFavoriteGamesData(future_info);
  return [Fres, past_ids];
}

async function getFavoritsGames(matches_ids_array) {
  let promises = [];
  matches_ids_array.map((id) =>
    promises.push(
      DButils.execQuery(`SELECT * FROM dbo.matches WHERE match_id = '${id}'`)
    )
  );
  let favorite_info = await Promise.all(promises);
  let future = [];
  let today = new Date(); // Today date
  let hours = String(today.getHours()).padStart(2, "0");
  let minute = String(today.getMinutes()).padStart(2, "0");
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();
  favorite_info.map((temp) => {
    let date_list = temp[0]["date"].split("/"); // Date of curr match
    let dd2 = date_list[0];
    let mm2 = date_list[1];
    let yyyy2 = date_list[2];
    let time_list = temp[0]["time"].split(":"); // Time of curr match
    let hours2 = time_list[0];
    let minute2 = time_list[1];
    if (yyyy > yyyy2) {
    } else if (yyyy == yyyy2) {
      if (mm > mm2) {
      } else if (mm == mm2) {
        if (dd > dd2) {
        } else if (dd == dd2) {
          // The same date
          if (hours > hours2) {
          } else if (hours == hours2) {
            // The same hours
            if (minute > minute2) {
            } else {
              future.push(temp);
            }
          } else {
            future.push(temp);
          }
        } else {
          future.push(temp);
        }
      } else {
        future.push(temp);
      }
    } else {
      future.push(temp);
    }
  });
  let future_info = await Promise.all(future);
  let Fres = extractFavoriteGamesData(future_info);
  return Fres;
}

// Handel favorite games
function extractFavoriteGamesData(favorite_info) {
  return favorite_info.map((game) => {
    const { date, time, hometeam, awayteam, stadium } = game[0];

    return {
      date: date,
      time: time,
      hometeam: hometeam,
      awayteam: awayteam,
      stadium: stadium,
    };
  });
}

async function getGamesDetails() {
  const matches = await DButils.execQuery(`SELECT * FROM matches`);
  let future = [];
  let past_ids = [];
  let today = new Date(); // Today date
  let hours = String(today.getHours()).padStart(2, "0");
  let minute = String(today.getMinutes()).padStart(2, "0");
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();
  matches.forEach((temp) => {
    let date_list = temp["date"].split("/"); // Date of curr match
    let dd2 = date_list[0];
    let mm2 = date_list[1];
    let yyyy2 = date_list[2];
    let time_list = temp["time"].split(":"); // Time of curr match
    let hours2 = time_list[0];
    let minute2 = time_list[1];
    if (yyyy > yyyy2) {
      past_ids.push(temp["match_id"]);
    } else if (yyyy == yyyy2) {
      if (mm > mm2) {
        past_ids.push(temp["match_id"]);
      } else if (mm == mm2) {
        if (dd > dd2) {
          past_ids.push(temp["match_id"]);
        } else if (dd == dd2) {
          // The same date
          if (hours > hours2) {
            past_ids.push(temp["match_id"]);
          } else if (hours == hours2) {
            // The same hours
            if (minute > minute2) {
              past_ids.push(temp["match_id"]);
            } else {
              future.push(temp);
            }
          } else {
            future.push(temp);
          }
        } else {
          future.push(temp);
        }
      } else {
        future.push(temp);
      }
    } else {
      future.push(temp);
    }
  });
  // console.log(past_ids);
  // console.log(future);
  let future_info = await Promise.all(future);
  let Fres = extractFutureGamesData(future_info);
  return [Fres, past_ids];
}

// Handel past games
async function extractPastGamesData(match_id) {
  let match = await DButils.execQuery(
    `SELECT * FROM dbo.matches WHERE match_id='${match_id}'`
  );
  if (match.length === 0) return {};
  match = match[0];
  // get events from DB
  let match_events = await getEvents(match_id);

  result = {
    date: match.date,
    time: match.time,
    hometeam: match.hometeam,
    awayteam: match.awayteam,
    stadium: match.stadium,
    result: match.result,
    events: match_events,
  };

  return result;
}

// gets match's all events
async function getEvents(match_id) {
  let events = await DButils.execQuery(
    `SELECT * FROM dbo.eventbook WHERE match_id='${match_id}'`
  );
  let res = [];
  events.map((eventDet) =>
    res.push({
      date: eventDet.date,
      time: eventDet.time,
      gamemin: eventDet.gamemin,
      event: eventDet.event,
    })
  );
  return res;
}

// Handel future games
function extractFutureGamesData(future_info) {
  return future_info.map((game) => {
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

// Handel next game
function getNextGame(games) {
  let next = games[0];

  games.forEach((temp) => {
    let next_date_list = next["date"].split("/"); // Date of next match
    let dd = next_date_list[0];
    let mm = next_date_list[1];
    let yyyy = next_date_list[2];
    let next_time_list = next["time"].split(":"); // Time of next match
    let hours = next_time_list[0];
    let minute = next_time_list[1];
    /////////////////////////////////////////
    let date_list = temp["date"].split("/"); // Date of curr match
    let dd2 = date_list[0];
    let mm2 = date_list[1];
    let yyyy2 = date_list[2];
    let time_list = temp["time"].split(":"); // Time of curr match
    let hours2 = time_list[0];
    let minute2 = time_list[1];
    if (yyyy > yyyy2) {
      next = temp;
    } else if (yyyy == yyyy2) {
      if (mm > mm2) {
        next = temp;
      } else if (mm == mm2) {
        if (dd > dd2) {
          next = temp;
        } else if (dd == dd2) {
          // The same date
          if (hours > hours2) {
            next = temp;
          } else if (hours == hours2) {
            // The same hours
            if (minute > minute2) {
              next = temp;
            }
          }
        }
      }
    }
  });
  return next;
}

exports.getGamesDetails = getGamesDetails;
exports.extractPastGamesData = extractPastGamesData;
exports.getFavoritsGames = getFavoritsGames;
exports.getNextGame = getNextGame;
exports.getTeamGames = getTeamGames;
