require("dotenv").config();
const axios = require("axios");
const bcrypt = require("bcrypt");
const fs = require("fs");
const { exec } = require("child_process");

const execAsync = util.promisify(exec);
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.AZURE_JSONWEB_TOKEN;

module.exports.authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({ serverStatus: -1, error: "Token ist ungültig" });
      }

      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ serverStatus: -1, error: "Token fehlt" });
  }
}
module.exports.CheckDatabase = (dbPath) => {
  if (!fs.existsSync(dbPath)) {
    CreateDatabase();
  }
};
module.exports.getUser = async (req, res, db) => {
  const { frontendPassword, username } = req.body;

  db.all(
    "SELECT user.*, role.* FROM user, role WHERE user.username=? AND user.role = role.roleid",
    [username],
    async (err, result) => {
      if (err) {
        return res.status(500).json({ serverStatus: -1, error: err.message });
      }

      if (result.length === 0) {
        return res.status(404).json({ serverStatus: -1 });
      }

      try {
        const match = await bcrypt.compare(
          frontendPassword,
          result[0].password
        );
        if (match) {
          // JWT-Token erstellen
          const token = jwt.sign(
            { id: result[0].userid, username: result[0].username, roleid: result[0].roleid, role: result[0].name },
            SECRET_KEY,
            { expiresIn: '8h' }
          );
          return res.status(200).json({
            result: {
              id: result[0].userid,
              username: result[0].username,
              roleid: result[0].roleid,
              role: result[0].name,
            },
            token, 
            serverStatus: 2,
          });
        } else {
          return res.status(401).json({ serverStatus: -1 });
        }
      } catch (compareError) {
        return res
          .status(500)
          .json({ serverStatus: -1, error: compareError.message });
      }
    }
  );
};
module.exports.updateUser = async (req, res, db) => {
  const { userid, username, password, role } = req.body;
  db.all(
    `UPDATE user SET username=?, password=?, role=? where userid=?`,
    [username, password, role, userid],
    (err) => {
      if (err) {
        res.status(500).json({ serverStatus: -1 });
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
  db.all(`DELETE FROM user WHERE userid=?`, [userid], (err) => {
    if (err) {
      res.status(500).json({ serverStatus: -1 });
    } else {
      res.status(200).json({ serverStatus: 2 });
    }
  });
};
module.exports.getShelf = async (req, res, db) => {
  db.all(`SELECt * FROM shelf`, (err, result) => {
    if (err) {
      res.status(500).json({ serverStatus: -1 });
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
    `SELECT DISTINCT(compartment.compartmentId), shelf.shelfid, shelf.shelfname, compartment.compartmentname, compartment.number
    FROM shelf
    JOIN compartment ON shelf.shelfid = compartment.shelfId 
    LEFT JOIN article ON compartment.compartmentId = article.compartment
    WHERE shelf.shelfid =? `,
    [shelfid],
    (err, result) => {
      if (err) {
        res.status(500).json({ serverStatus: -1 });
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
      } else {
        CreateCompartments(db, CountCompartment);
        res.status(200).json(result);
      }
    }
  );
};
module.exports.getArticle = async (req, res, db) => {
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
      } else {
        res.status(200).json(result);
      }
    }
  );
};
module.exports.getAllArticle = async (req, res, db) => {
  db.all(
    `
SELECT article.*, COALESCE(company.companyName, 'NULL') AS companyName, company.*, shelf.shelfName, compartment.compartmentname
FROM article
LEFT JOIN shelf on article.shelf = shelf.shelfId
LEFT JOIN company ON article.company = company.companyId
LEFT JOIN compartment on article.compartment = compartment.compartmentId;`,
    (err, result) => {
      if (err) {
        res.status(500).json({ serverStatus: -1 });
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
    selectedCompany,
    commissiongoods,
    minRequirement,
  } = req.body;
  db.all(
    `INSERT INTO article (articlename,count,compartment,shelf,unit,categoryid,company,commission,minRequirement) VALUES (?,?,?,?,?,?,?,?,?)`,
    [
      articlename,
      amount,
      selectedCompartment,
      selectedShelf,
      unit,
      selectedCategory,
      selectedCompany,
      commissiongoods,
      minRequirement,
    ],
    (err, result) => {
      if (err) {
        res.status(500).json({ serverStatus: -1 });
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
      } else {
        res.status(200).json(result);
      }
    }
  );
};
module.exports.updateArticle = async (req, res, db) => {
  const {
    articleid,
    articlename,
    unit,
    amount,
    shelf,
    compartment,
    category,
    minRequirement,
  } = req.body;
  db.all(
    `UPDATE article SET articlename=?,count=?,compartment=?,shelf=?,unit=?,categoryid=?, minRequirement=? WHERE articleid=?`,
    [
      articlename,
      amount,
      compartment,
      shelf,
      unit,
      category,
      minRequirement,
      articleid,
    ],
    (err) => {
      if (err) {
        res.status(500).json({ serverStatus: -1 });
      } else {
        res.status(200).json({ serverStatus: 2 });
      }
    }
  );
};
module.exports.deleteArticle = async (req, res, db) => {
  const { articleid } = req.body;
  db.all(`DELETE FROM article WHERE articleid=?`, [articleid], (err) => {
    if (err) {
      res.status(500).json({ serverStatus: -1 });
    } else {
      res.status(200).json({ serverStatus: 2 });
    }
  });
};
module.exports.createUser = async (req, res, db) => {
  const saltRounds = 12;
  const { name, password, roleid } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    db.all(
      `INSERT INTO user (username, password, role) VALUES (?,?,?)`,
      [name, hashedPassword, roleid],
      (err, result) => {
        if (err) {
          res.status(500).json({ serverStatus: -1 });
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
    (err) => {
      if (err) {
        res.status(500).json({ serverStatus: -1 });
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
    } else {
      const data = {
        result: result,
        serverStatus: 2,
      };
      res.status(200).json({ data });
    }
  });
};
module.exports.getCompany = async (req, res, db) => {
  db.all(`SELECT * from company `, (err, result) => {
    if (err) {
      res.status(500).json({ serverStatus: -1 });
    } else {
      const data = {
        result: result,
        serverStatus: 2,
      };
      res.status(200).json({ data });
    }
  });
};
module.exports.deleteCategory = async (req, res, db) => {
  const { categoryid } = req.body;
  db.all(`DELETE FROM category WHERE categoryid=?`, [categoryid], (err) => {
    if (err) {
      res.status(500).json({ serverStatus: -1 });
    } else {
      res.status(200).json({ serverStatus: 2 });
    }
  });
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
      } else {
        const data = {
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
    (err) => {
      if (err) {
        res.status(500).json({ serverStatus: -1 });
      } else {
        res.status(200).json({ serverStatus: 2 });
      }
    }
  );
};
module.exports.getController = async (req, res, db) => {
  db.all(
    `SELECT ledController.*, shelf.*
FROM ledController
LEFT JOIN shelf ON ledController.shelfid = shelf.shelfid
WHERE ledController.shelfid IS NOT NULL
   OR ledController.shelfid IS NULL;`,
    (err, result) => {
      if (err) {
        res.status(500).json({ serverStatus: -1 });
      } else {
        res.status(200).json(result);
      }
    }
  );
};
module.exports.UpdateLedController = async (req, res, db) => {
  const { ip, shelfid, status, controllerid } = req.body;
  db.all(
    `UPDATE ledController SET ipAdresse =?, shelfid=?, status=? WHERE ledControllerid=?`,
    [ip, shelfid, status, controllerid],
    (err) => {
      if (err) {
        res.status(500).json({ serverStatus: -1 });
      } else {
        res.status(200).json({ serverStatus: 2 });
      }
    }
  );
};
module.exports.CreateLedController = async (req, res, db) => {
  const { ipAdress, shelf } = req.body;
  // Ping LEDController for status
  let tempStatus;
  try {
    const response = await axios.get("http://192.168.188.48");
    if (response.status === 200) {
      tempStatus = "Connected";
    } else {
      tempStatus = "Disconnected";
    }
  } catch (error) {
    console.log("Error pinging ESP32:", error);
    tempStatus = "undefinded";
  }
  const status = tempStatus;

  // Create n Controllerfunction with ledControllerid
  db.all(
    `INSERT INTO ledController (ipAdresse, shelfid, status) VALUES (?,?,?)`,
    [ipAdress, shelf, status],
    (error, result) => {
      if (error) {
        res.status(500).json({ serverStatus: -1 });
      } else {
        res.status(200).json({ result: result, serverStatus: 2 });
      }
    }
  );
  CreateControllerFunction(db, res, shelf);
};
module.exports.DeleteLedController = async (req, res, db) => {
  const { deviceId } = req.body;
  db.all(
    `DELETE FROM ledController WHERE ledControllerid=?`,
    [deviceId],
    (error) => {
      if (error) {
        res.status(500).json({ serverStatus: -1 });
      } else {
        res.status(200).json({ serverStatus: 2 });
      }
    }
  );
  await DeleteControllerFunction(db, deviceId);
};
module.exports.ControllerOff = async (req, res, db) => {
  const { shelfid } = req.body;
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM ledController WHERE shelfid=?`,
      [shelfid],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          LedOff(result.ipAdresse);
          res.status(200).json({ serverStatus: 2 });
        }
      }
    );
  });
};
module.exports.PingController = async (req, res) => {
  const { ip } = req.body;
  try {
    const ping = await fetch(`http://${ip}`);
    if (ping.status === 200) {
      res.status(200).json({ serverStatus: 2 });
    } else {
      res.status(404).json({ serverStatus: -1 });
    }
  } catch (error) {
    res.status(500).json("Controller nicht erreichbar");
  }
};
const LedOff = async (ipAdresse) => {
  await fetch(`http:/${ipAdresse}/led/off`);
};
const CreateCompartments = (db, countCompartment) => {
  db.get("SELECT last_insert_rowid() as shelfId", (row) => {
    const shelfId = row.shelfId;

    for (let i = 0; i < countCompartment; i++) {
      db.all(
        `INSERT INTO compartment (compartmentname,shelfid,number) VALUES(?,?,?)`,
        [i + 1 + "-Fach", shelfId, i + 1]
      );
    }
  });
};
const CreateControllerFunction = async (db, res, shelf) => {
  try {
    // get list of compartments from shelfs
    const compartmentList = await getCompartments(db, shelf);

    // last created Controller
    const controllerId = await getLastInsertRowId(db);

    // insert controllerfunction
    await insertControllerFunction(db, controllerId, compartmentList);
  } catch (error) {
    console.error(error);
  }
};
const getLastInsertRowId = (db) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT last_insert_rowid() as ledControllerid", (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row.ledControllerid);
      }
    });
  });
};
const getCompartments = (db, shelf) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT compartmentId from compartment WHERE shelfId = ?`,
      [shelf],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};
const DeleteControllerFunction = async (db, deviceId) => {
  try {
    await db.all(`DELETE FROM ControllerFunctions WHERE controllerId =?`, [
      deviceId,
    ]);
  } catch (error) {
    console.log(error);
  }
};
const insertControllerFunction = async (db, controllerId, compartmentList) => {
  for (let i = 0; i < compartmentList.length; i++) {
    await db.run(
      `INSERT INTO ControllerFunctions (controllerId, functionName, compartmentid) VALUES (?,?,?)`,
      [controllerId, "led" + (i + 1) + "/on", compartmentList[i].compartmentId]
    );
  }
  // Led off controllerFunction
  await db.run(
    `INSERT INTO ControllerFunctions (controllerId, functionName) VALUES (?,?)`,
    [controllerId, "led/off"]
  );
};
const CreateDatabase = () => {
  exec(`python3 ./Scripts/InitialDatabase.py`, (error, stderr) => {
    if (error) {
      console.error(`Error executing Python script: ${error.message}`);
    }
    if (stderr) {
      console.error(`Python script error: ${stderr}`);
    }
  });
};
