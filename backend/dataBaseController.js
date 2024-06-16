require("dotenv").config();
const bcrypt = require("bcrypt");

module.exports.getUser = async (req, res, db) => {
  const { frontendPassword } = req.body;
  const { user } = req.query;
  db.all(
    "SELECT user.*, role.name FROM user, role WHERE userid=? AND user.role = role.roleid",
    [user],
    async (err, result) => {
      if (err) {
        res.status(500).json({ serverStatus: -1 });
        return;
      }
      if (result.length > 0) {
        try {
          // Compare the provided password with the stored hashed password
          const match = await bcrypt.compare(
            frontendPassword,
            result[0].password
          );
          if (match) {
            const data = {
              result,
              serverStatus: 2,
            };
            res.status(200).json(data);
          }
        } catch (compareError) {
          res
            .status(500)
            .json({ serverStatus: -1, error: compareError.message });
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
module.exports.getCompartArticleForm = async (req, res, db) => {
  const { shelfid } = req.body;
  db.all(
    `SELECT shelf.shelfid, shelf.shelfname, compartment.compartmentname, compartment.number, compartmentId
    FROM shelf
    JOIN compartment ON shelf.shelfid = compartment.shelfId 
    LEFT JOIN article ON compartment.compartmentId = article.compartment
    WHERE (article.compartment IS NULL OR article.compartment = '') AND shelf.shelfid =? `,
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
module.exports.getCompartments = async (req, res, db) => {
  const { shelfid } = req.body;
  db.all(
    `SELECT shelf.shelfid, shelf.shelfname, compartment.compartmentname, compartment.number, compartmentId
    FROM shelf
    JOIN compartment ON shelf.shelfid = compartment.shelfId 
    LEFT JOIN article ON compartment.compartmentId = article.compartment
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
    `SELECT 
   * 
FROM 
    article
    LEFT JOIN compartment ON article.compartment = compartment.compartmentId
    LEFT JOIN shelf ON article.shelf = shelf.shelfid;`,
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
module.exports.getAllArticle = async (req, res, db) => {
  db.all(`SELECT * from article`, (err, result) => {
    if (err) {
      res.status(500).json({ serverStatus: -1 });
      return;
    } else {
      res.status(200).json(result);
    }
  });
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
  const {
    articlename,
    amount,
    unit,
    selectedShelf,
    selectedCompartment,
    selectedCategory,
    companyName,
    commissiongoods,
  } = req.body;
  db.all(
    `INSERT INTO article (articlename,count,compartment,shelf,unit,categoryid,company, commission) VALUES (?,?,?,?,?,?,?,?)`,
    [
      articlename,
      amount,
      selectedCompartment,
      selectedShelf,
      unit,
      selectedCategory,
      companyName,
      commissiongoods,
    ],
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
  const { articleid, articlename, unit, amount, shelf, compartment, category } =
    req.body;
  db.all(
    `UPDATE article SET articlename=?,count=?,unit=?,compartment=?,shelf=?,categoryid=? WHERE articleid=?`,
    [articlename, amount, unit, compartment, shelf, articleid, category],
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
  const saltRounds = 10;
  const { name, password, roleid } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    db.all(
      `INSERT INTO user (username, password, role) VALUES (?,?,?)`,
      [name, hashedPassword, roleid],
      (err, result) => {
        if (err) {
          res.status(500).json({ serverStatus: -1 });
          return;
        } else {
          res.status(200).json(result);
        }
      }
    );
  } catch (err) {
    res.status(500).json({ serverStatus: -1, error: err.message });
  }
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
module.exports.createCategory = async (req, res, db) => {
  const { categoryName } = req.body;
  db.all(
    `INSERT INTO category (categoryname) VALUES(?)`,
    [categoryName],
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
module.exports.getCategory = async (req, res, db) => {
  db.all(`SELECT * from category `, (err, result) => {
    if (err) {
      res.status(500).json({ serverStatus: -1 });
      return;
    } else {
      data = {
        result: result,
        serverStatus: 2,
      };
      res.status(200).json({ data });
    }
  });
};
module.exports.deleteCategory = async (req, res, db) => {
  const { categoryid } = req.body;
  db.all(
    `DELETE FROM category WHERE categoryid=?`,
    [categoryid],
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
module.exports.getControllerFunction = async (req, res, db) => {
  const { compId } = req.body;
  db.all(
    `
  SELECT cf.functionName, cf.compartmentid, lc.ipAdresse, c.compartmentname from Controllerfunctions cf, ledcontroller lc, compartment c, shelf
  WHERE lc.shelfid = shelf.shelfid and c.shelfId = shelf.shelfid and c.compartmentId = cf.compartmentid and c.compartmentid = ?`,
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
module.exports.getLedOff = async (req, res, db) => {
  const { shelfid } = req.body;
  db.all(
    `
  SELECT functionName, ledController.ipAdresse 
  FROM shelf, ledController, ControllerFunctions 
  WHERE 
  shelf.shelfid =? AND
  shelf.controllerId = ledController.ledControllerid AND 
  ControllerFunctions.controllerId = ledController.ledControllerid AND 
  compartmentid IS NULL`,
    [shelfid],
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
module.exports.getArticleWithCategory = async (req, res, db) => {
  const { categoryid } = req.body;
  db.all(
    `SELECT * from article WHERE categoryid ="null" or categoryid ISNULL or categoryid =?`,
    [categoryid],
    (err, result) => {
      if (err) {
        res.status(500).json({ serverStatus: -1 });
        return;
      } else {
        data = {
          serverStatus: 2,
          result: result,
        };
        res.status(200).json(data);
      }
    }
  );
};
module.exports.UpdateArticleCategory = async (req, res, db) => {
  const { value, selectedArticle } = req.body;
  db.all(
    `UPDATE article SET categoryid=? WHERE articleid=?`,
    [value, selectedArticle],
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
