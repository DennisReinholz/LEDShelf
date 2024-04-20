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
    `
    SELECT compartment.*FROM shelf,compartment WHERE shelf.shelfid=? AND shelf.shelfid = compartment.shelfId
    `,
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
module.exports.getAllUser = async (req, res, db) => {
  db.all(
    `SELECT user.username, role.name FROM user,role WHERE user.role = role.roleid`,
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

module.exports.postCreateShelf = async (req, res, db) => {
  const { shelfname, shelfPlace, CountCompartment } = req.body;
  db.all(
    `INSERT INTO shelf (shelfname,place,countCompartment) VALUES (?,?,?)`,
    [shelfname, shelfPlace, CountCompartment],
    (err, result) => {
      if (err) {
        res.status(500).json({ serverStatus: -1 });
        return;
      } else {
        const data = {
          result,
          serverStatus: 2,
        };
        CreateCompartments(db, CountCompartment);
        res.status(200).json(data);
      }
    }
  );
};

const CreateCompartments = (db, countCompartment) => {
  db.get("SELECT last_insert_rowid() as shelfId", (err, row) => {
    const shelfId = row.shelfId;

    for (let i = 0; i < countCompartment; i++) {
      db.all(`INSERT INTO compartment (compartmentname,shelfid) VALUES(?,?)`, [
        i + 1 + "-Fach",
        shelfId,
      ]);
    }
  });
};
