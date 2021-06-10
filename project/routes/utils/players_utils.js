const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
// const TEAM_ID = "85";

// RETURN PLAYERS ALL INFO FOR PAGE
async function getPlayerPage(player_id) {
  let player_page = await getPlayerData(player_id);
  return player_page;
}

async function getPlayerData(player_id) {
  const player = await axios.get(`${api_domain}/players/${player_id}`, {
    params: {
      api_token: process.env.api_token,
    },
  });
  let moreDet = await getPlayersInfo([player.data.data.team_id]);
  return {
    player_id: player.data.data.player_id,
    name: moreDet[0]["name"],
    team_name: moreDet[0]["team_name"],
    image: moreDet[0]["image"],
    position: moreDet[0]["position"],
    commonname: player.data.data.common_name,
    nationality: player.data.data.nationality,
    birthdate: player.data.data.birthdate,
    birthplace: player.data.data.birthplace,
    height: player.data.data.height,
    weight: player.data.data.weight,
  };
}

async function getPlayerIdsByTeam(team_id) {
  let player_ids_list = [];
  const team = await axios.get(`${api_domain}/teams/${team_id}`, {
    params: {
      include: "squad",
      api_token: process.env.api_token,
    },
  });
  team.data.data.squad.data.map((player) =>
    player_ids_list.push(player.player_id)
  );
  return player_ids_list;
}

async function getPlayersInfo(players_ids_list) {
  let promises = [];
  players_ids_list.map((id) =>
    promises.push(
      axios.get(`${api_domain}/players/${id}`, {
        params: {
          api_token: process.env.api_token,
          include: "team",
        },
      })
    )
  );
  let players_info = await Promise.all(promises);
  return extractRelevantPlayerData(players_info);
}

function extractRelevantPlayerData(players_info) {
  return players_info.map((player_info) => {
    const { fullname, image_path, position_id } = player_info.data.data;
    const { name } = player_info.data.data.team.data;

    return {
      name: fullname,
      team_name: name,
      image: image_path,
      position: position_id,
    };
  });
}

async function getPlayersByTeam(team_id) {
  let player_ids_list = await getPlayerIdsByTeam(team_id);
  let players_info = await getPlayersInfo(player_ids_list);
  return players_info;
}

// RETURN ALL PLAYERS
async function getPlayerDetails(player_name) {
  let player_list = [];
  const player = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/players/search/${player_name}`,
    {
      params: {
        api_token: process.env.api_token,
        include: "team",
      },
    }
  );
  player.data.data.map((players) => player_list.push(players));
  let players_info = await Promise.all(player_list);
  return extractSearchPlayerData(players_info);
}

function extractSearchPlayerData(players_info) {
  let name = "Not in a team";
  return players_info.map((player_info) => {
    const { player_id, fullname, image_path, position_id } = player_info;
    if (player_info.hasOwnProperty("team")) {
      name = player_info.team.data.name;
    }

    return {
      player_id: player_id,
      name: fullname,
      team_name: name,
      image: image_path,
      position: position_id,
    };
  });
}

exports.getPlayersByTeam = getPlayersByTeam;
exports.getPlayersInfo = getPlayersInfo;
exports.getPlayerPage = getPlayerPage;
exports.getPlayerDetails = getPlayerDetails;
