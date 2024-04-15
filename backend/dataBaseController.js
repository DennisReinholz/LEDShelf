require("dotenv").config();

module.exports.getUser = async (req, res, db) => {
  const { frontendPassword } = req.body;
  const { user } = req.query;
  db.all(
    "SELECT user.*, role.name FROM user, role WHERE username=? AND user.role = role.roleid",
    [user],
    (err, result) => {
      if (err) {
        res.status(500).json({ serverStatus: -1 });
        return;
      } else {
        if (result === undefined || result === null || result.length === 0) {
          res.send({ serverStatus: -2 });
        } else if (frontendPassword === result[0].password) {
          const data = {
            result,
            serverStatus: 2,
          };
          res.status(200).json(data);
        }
      }
    }
  );
};
module.exports.getShelf = async (req, res, db) => {
  db.all(`SELECt * FROM shelf`, (err, result) => {
    if (err) {
      res.status(500).json({ serverStatus: -1 });
      return;
    } else {
      const data = {
        result,
        serverStatus: 2,
      };
      res.status(200).json(data);
    }
  });
};
module.exports.getCompartments = async (req, res, db) => {
  const { shelfid } = req.body;
  db.all(
    `SELECt article.*, shelf.shelfname FROM article, shelf WHERE shelf=? AND article.shelf = shelf.shelfid`,
    [shelfid],
    (err, result) => {
      if (err) {
        res.status(500).json({ serverStatus: -1 });
        return;
      } else {
        const data = {
          result,
          serverStatus: 2,
        };
        res.status(200).json(data);
      }
    }
  );
};
