const DButils = require("./DButils");

// ADD MATCH TO FAVORITS
async function markMatchAsFavorite(user_id, match_id) {
  await DButils.execQuery(
    `INSERT INTO dbo.favorits (user_id,match_id) VALUES ('${user_id}','${match_id}')`
  );
}

// GET ALL USER'S FAVORITS
async function getFavoriteMatches(user_id) {
  const matches_ids = await DButils.execQuery(
    `SELECT match_id FROM dbo.favorits where user_id = '${user_id}'`
  );
  return matches_ids;
}

exports.markMatchAsFavorite = markMatchAsFavorite;
exports.getFavoriteMatches = getFavoriteMatches;
