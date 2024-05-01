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
          res.status(500).send({ serverStatus: -2 });
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
module.exports.updateUser = async (req, res, db) => {
  const { userid, username, password, role } = req.body;
  db.all(
    `UPDATE user SET username=?, password=?, role=? where userid=?`,
    [username, password, role, userid],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ serverStatus: -1 });
        return;
      } else {
        res.status(200).json({ serverStatus: 2 });
      }
    }
  );
};
module.exports.getUserData = async (req, res, db) => {
  const { userid } = req.body;
  db.all(`SELECT * from user WHERE userid=?`, [userid], (err, result) => {
    if (err) {
      console.log(`Unable to get UserData from ${userid}`);
      res.sendStatus(500);
    } else {
      res.status(200).json(result);
    }
  });
};
module.exports.deleteUser = async (req, res, db) => {
  const { userid } = req.body;
  db.all(`DELETE FROM user WHERE userid=?`, [userid], (err, result) => {
    if (err) {
      res.status(500).json({ serverStatus: -1 });
      return;
    } else {
      res.status(200).json({ serverStatus: 2 });
    }
  });
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
    `SELECT shelf.shelfid, shelf.shelfname, compartment.compartmentname, compartment.number, compartmentId
    FROM shelf 
    JOIN compartment ON shelf.shelfid = compartment.shelfId 
    WHERE shelf.shelfid =? `,
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
    `SELECT user.userid,user.username, role.name FROM user,role WHERE user.role = role.roleid`,
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
        CreateCompartments(db, CountCompartment);
        res.status(200).json(result);
      }
    }
  );
};
module.exports.getArticle = async (req, res, db) => {
  //Regal name herausfinden
  db.all(
    `SELECT article.*, shelf.shelfname, compartment.compartmentname 
    FROM article, compartment 
    LEFT JOIN shelf ON article.shelf = shelf.shelfid
    WHERE article.compartment = compartment.compartmentId`,
    (err, result) => {
      if (err) {
        res.status(500).json({ serverStatus: -1 });
        return;
      } else {
        res.status(200).json(result);
      }
    }
  );
};
module.exports.getArticleInCompartment = async (req, res, db) => {
  const { compId } = req.body;
  db.all(
    `SELECT * from article WHERE compartment =?`,
    [compId],
    (err, result) => {
      if (err) {
        res.status(500).json({ serverStatus: -1 });
        return;
      } else {
        res.status(200).json(result);
      }
    }
  );
};
module.exports.createArticle = async (req, res, db) => {
  const { articlename, amount, unit, selectedShelf, selectedCompartment } =
    req.body;
  db.all(
    `INSERT INTO article (articlename,count,compartment,shelf,unit) VALUES (?,?,?,?,?)`,
    [articlename, amount, selectedCompartment, selectedShelf, unit],
    (err, result) => {
      if (err) {
        res.status(500).json({ serverStatus: -1 });
        return;
      } else {
        res.status(200).json(result);
      }
    }
  );
};
module.exports.getSelectedArticle = async (req, res, db) => {
  const { articleid } = req.body;
  db.all(
    `SELECT article.*, shelf.shelfname 
    FROM article 
    LEFT JOIN shelf ON article.shelf = shelf.shelfid
    WHERE articleid=?`,
    [articleid],
    (err, result) => {
      if (err) {
        res.status(500).json({ serverStatus: -1 });
        return;
      } else {
        res.status(200).json(result);
      }
    }
  );
};
module.exports.updateArticle = async (req, res, db) => {
  const { articleid, articlename, unit, amount, shelf, compartment } = req.body;
  db.all(
    `UPDATE article SET articlename=?,count=?,unit=?,compartment=?,shelf=? WHERE articleid=?`,
    [articlename, amount, unit, compartment, shelf, articleid],
    (err, result) => {
      if (err) {
        res.status(500).json({ serverStatus: -1 });
        return;
      } else {
        res.status(200).json({ serverStatus: 2 });
      }
    }
  );
};
module.exports.deleteArticle = async (req, res, db) => {
  const { articleid } = req.body;
  db.all(
    `DELETE FROM article WHERE articleid=?`,
    [articleid],
    (err, result) => {
      if (err) {
        res.status(500).json({ serverStatus: -1 });
        return;
      } else {
        res.status(200).json({ serverStatus: 2 });
      }
    }
  );
};
module.exports.createUser = async (req, res, db) => {
  const { name, password, roleid } = req.body;
  db.all(
    `INSERT INTO user (username, password, role) VALUES (?,?,?)`,
    [name, password, roleid],
    (err, result) => {
      if (err) {
        res.status(500).json({ serverStatus: -1 });
        return;
      } else {
        res.status(200).json(result);
      }
    }
  );
};
module.exports.getRoles = async (req, res, db) => {
  db.all(`SELECT * from role`, (err, result) => {
    if (err) {
      res.status(500).json({ serverStatus: -1 });
      return;
    } else {
      res.status(200).json(result);
    }
  });
};
module.exports.updateArticleCount = async (req, res, db) => {
  const { newArticleCount, articleid } = req.body;
  db.all(
    `Update article SET count=? WHERE articleid=?`,
    [newArticleCount, articleid],
    (err, result) => {
      if (err) {
        res.status(500).json({ serverStatus: -1 });
        return;
      } else {
        res.status(200).json(result);
      }
    }
  );
};
const CreateCompartments = (db, countCompartment) => {
  db.get("SELECT last_insert_rowid() as shelfId", (err, row) => {
    const shelfId = row.shelfId;

    for (let i = 0; i < countCompartment; i++) {
      db.all(
        `INSERT INTO compartment (compartmentname,shelfid,number) VALUES(?,?,?)`,
        [i + 1 + "-Fach", shelfId, i + 1]
      );
    }
  });
};
