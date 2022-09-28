const Keyrock = require("../helpers/keyrock");

async function auth(req, res, next) {
  const token = req.header("Token");
  if (!token) {
    return res.status(404).send({ error: "Token not found" });
  }

  Keyrock.validateToken(token)
    .then(next())
    .catch(res.status(401).send({ error: "User not allowed" }));
  //next();
}

module.exports = auth;
