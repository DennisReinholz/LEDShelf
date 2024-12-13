require("dotenv").config();
const bcrypt = require("bcrypt");
const fs = require("fs");
const { exec } = require("child_process");
const util = require("util");
const execAsync = util.promisify(exec);
const jwt = require("jsonwebtoken");
const ping = require("ping");
const path = require("path");
const bonjour = require("bonjour")();
const dnssd = require('dnssd');

const SECRET_KEY = process.env.AZURE_JSONWEB_TOKEN;

module.exports.authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

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
};
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
            { expiresIn: "8h" }
          );
          res.status(200).json({
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
          res.status(401).json({ serverStatus: -1 });
        }
      } catch (compareError) {
        res
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
module.exports.getShelfConfiguration = async (req, res, db) => {
  const { shelfid } = req.body;
  db.all(
    `SELECT *
      FROM shelf
      JOIN compartment ON shelf.shelfid = compartment.shelfId
      LEFT JOIN article ON compartment.compartmentId = article.compartment
      WHERE shelf.shelfid = ?`,
    [shelfid],
    (err, result) => {
      if (err) {
        res.status(500).json({ serverStatus: -2, err });
      } else {
        res.status(200).json({ serverStatus: 1, data: result });
      }
    }
  );
};
module.exports.deleteCompartment = async (req, res, db) => {
  const { compartmentId } = req.body;
  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    // Delete from 'compartment' table where shelfid matches
    db.run(`DELETE FROM compartment WHERE compartment.compartmentId =?`, [compartmentId], (err) => {
      if (err) {
        db.run("ROLLBACK"); 
        return res.status(500).json({ serverStatus: -2, error: "Failed to delete from compartment" });
      }

      // Delete references compartment and shelf
      db.run(`UPDATE article SET compartment = null, shelf = null WHERE article.compartment = ?`, [compartmentId], (err) => {
        if (err) {
          db.run("ROLLBACK"); 
          return res.status(500).json({ serverStatus: -2, error: "Failed to delete from shelf" });
        }

      });
      db.run("COMMIT");
      return res.status(200).json({ serverStatus: 1 });
    });
  });
};
module.exports.getCompartArticleForm = async (req, res, db) => {
  const { shelfid } = req.body;
  db.all(
    `SELECT shelf.shelfid, shelf.shelfname, compartment.compartmentname, compartment.number, compartmentId, compartment.height
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
    WHERE shelf.shelfid =?`,
    [shelfid],
    (err, result) => {
      if (err) {
        res.status(500).json({ serverStatus: -1 });
      } else {        
        const compartments = result.reduce((acc, row) => {
       
          const compartment = acc.find(c => c.compartmentId === row.compartmentId);
          if (compartment) {
       
            if (row.articleId) {
              compartment.articles.push({
                articleId: row.articleId,
                articlename: row.articlename,
              });
            }
          } else {
            acc.push({
              compartmentId: row.compartmentId,
              shelfid: row.shelfid,
              shelfname: row.shelfname,
              compartmentname: row.compartmentname,
              number: row.number,
              articles: row.articleId ? [{ articleId: row.articleId, articlename: row.articlename }] : [],
            });
          }
          return acc;
        }, []);

        // Rückgabe der gegliederten Daten
        res.status(200).json({ result: compartments, serverStatus: 2 });
      }
    }
  );
};

module.exports.getAllUser = async (req, res, db) => {
  db.all(
    `SELECT 
  user.userid, 
  user.username, 
  role.name 
FROM 
  user
INNER JOIN 
  role 
ON 
  user.role = role.roleid
WHERE 
  user.username != 'ledshelfadmin';`,
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
  const { shelfname, shelfPlace, CountCompartment, shelves } = req.body;
  db.run(
    `INSERT INTO shelf (shelfname, place, countCompartment) VALUES (?, ?, ?)`,
    [shelfname, shelfPlace, CountCompartment],
    function (err) {
      if (err) {
        res.status(500).json({ serverStatus: -1 });
      } else {
        const shelfId = this.lastID;

        // Rufe die CreateCompartments-Funktion auf und übergebe die shelfId
        CreateCompartments(db, CountCompartment, shelfId, shelves);

        res.status(200).json({ serverStatus: 2, shelfId });
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
    `SELECT article.*, shelf.shelfname, compartment.* 
   FROM article 
   LEFT JOIN shelf ON article.shelf = shelf.shelfid
   LEFT JOIN compartment ON article.compartment = compartment.compartmentId
   WHERE article.articleid = ?`,
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
    SELECT comp.*, ledController.* 
    FROM compartment comp, ledController
    WHERE ledController.shelfid = comp.shelfId AND comp.compartmentid = ?`,
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
  const { ipAdress, countCompartment } = req.body;
  let tempStatus;
  try {
    const result = await ping.promise.probe(ipAdress);
    if (result.alive) {

      tempStatus = "Connected";
    } else {
      tempStatus = "Disconnected";
    }
  } catch (error) {
    tempStatus = "undefinded";
  }
  const status = tempStatus;

  // Create n Controllerfunction with ledControllerid
  db.all(
    `INSERT INTO ledController (ipAdresse, numberCompartment ,status) VALUES (?,?,?)`,
    [ipAdress, countCompartment, status],
    (error, result) => {
      if (error) {
        res.status(500).json({ serverStatus: -1 });
      } else {
        res.status(200).json({ result: result, serverStatus: 2 });
      }
    }
  );
  CreateControllerFunction(db, res, countCompartment);
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
  try {
    return new Promise((resolve, reject) => {
      db.get(
      `SELECT * FROM ledController WHERE shelfid=?`,
      [shelfid],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          LedOff(result?.ipAdresse);
          res.status(200).json({ serverStatus: 2 });
        }
      }
      );
    });
  } catch (error) {
    res.status(500).json({ serverStatus: -1 }); 
  }
  
};
module.exports.PingController = async (req, res) => {
  const { ip } = req.body;
  try {
    const result = await ping.promise.probe(ip);
    if (result.alive) {
      res.status(200).json({ serverStatus: 2 });
    } else {
      res.status(404).json({ serverStatus: -1 });
    }
  } catch (error) {
    res.status(500).json("Controller nicht erreichbar");
  }
};
module.exports.CreateDatabase = async () => {
  try {
    const { stderr } = await execAsync(`python3 ./Scripts/InitialDatabase.py`);

    if (stderr) {
      console.error(`Python script error: ${stderr}`);
      return;
    }
  } catch (error) {
    console.error(`Error executing Python script: ${error.message}`);
  }
};
module.exports.RemoveArticleFromShelf = async (req, res, db) => {
  const { articleid } = req.body;
  db.run(`UPDATE article SET compartment = null, shelf = null WHERE articleid =?`, [articleid], (err) => {
    if (err) {
      res.status(500).json({ serverStatus: -1 });
    } else {
      res.status(200).json({ serverStatus: 2 });
    }
  });
};

const LedOff = async (ipAdresse) => {
  try {
    await fetch(`http:/${ipAdresse}/led/alloff`);
  } catch (error) {
    console.error("Unable to call LED OFF.", error);
  }  
};

module.exports.RenameShelf = async (req, res, db) => {
  const { shelfId, shelfname } = req.body;
  db.run(`UPDATE shelf SET shelfname=? WHERE shelfid = ?`, [shelfname, shelfId], (err) => {
    if (err) {
      res.status(500).json({ serverStatus: -2 });
    } else {
      res.status(200).json({ serverStatus: 1 });
    }
  });
};
module.exports.DeleteShelf = async (req, res, db) => {
  const { shelfId } = req.body;
  // Begin transaction to ensure both deletes succeed or fail together
  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    // Delete from 'compartment' table where shelfid matches
    db.run(`DELETE FROM compartment WHERE shelfid = ?`, [shelfId], (err) => {
      if (err) {
        db.run("ROLLBACK"); 
        return res.status(500).json({ serverStatus: -2, error: "Failed to delete from compartment" });
      }

      // Delete from 'shelf' table where shelfid matches
      db.run(`DELETE FROM shelf WHERE shelfid = ?`, [shelfId], (err) => {
        if (err) {
          db.run("ROLLBACK"); 
          return res.status(500).json({ serverStatus: -2, error: "Failed to delete from shelf" });
        }

        // delete reference from article
        db.run(`UPDATE article SET shelf = null WHERE shelf = ?`, [shelfId], (err) => {
          if (err) {
            db.run("ROLLBACK"); 
            return res.status(500).json({ serverStatus: -2, error: "Failed to delete from shelf" });
          }

          db.run("COMMIT");
          return res.status(200).json({ serverStatus: 1 });
        });
      });
    });
  });
};
module.exports.GetDatabaseName = async (req, res, ledshelfDatabasePath) => {
  try {
    
    if (ledshelfDatabasePath === undefined) {
      return res.status(404).json({ serverStatus: -2, message: "Datenbankpfad nicht gefunden" });
    }
    const dbPath = ledshelfDatabasePath;
    const dbName = path.basename(dbPath);
    res.status(200).json({ serverStatus: 1, databaseName: dbName });
  } catch (error) {
    console.error("Fehler beim Abrufen des Datenbanknamens:", error);
    res.status(500).json({ serverStatus: -2, message: "Interner Serverfehler" });
  }
};

module.exports.ExportDatabase = async (req, res, ledshelfDatabasePath) => {

  const dbName = path.basename(ledshelfDatabasePath);
  res.download(ledshelfDatabasePath, dbName, (err) => {
    if (err) {
      console.error("Fehler beim Herunterladen der Datenbank:", err);
      res.status(500).json({ serverStatus: -2 });
    }
  });
};

module.exports.ReplaceShelf = async (req, res, db) => {
  const { shelfId, place } = req.body;
  db.run(`UPDATE shelf SET place=? WHERE shelfid = ?`, [place, shelfId], (err) => {
    if (err) {
      res.status(500).json({ serverStatus: -2 });
    } else {
      res.status(200).json({ serverStatus: 1 });
    }
  });
};
module.exports.SearchDevices = async (req, res, db) => {
  let dbControllers = [];
  const devices = [];
  let responseSent = false;

  console.log("Searching network");
  
  try {
    await db.all(`SELECT ipAdresse FROM ledController`, (err, rows) => {
      if (err) {
        return res.status(500).json({ serverStatus: -1, message: "Fehler beim Lesen der Datenbank" });
      }
      
      dbControllers = rows.map(row => row.ipAdresse);
    });

    const browser = new dnssd.Browser(dnssd.tcp('http'));

    browser.on('serviceUp', (service) => {
      console.log('Gefundener Dienst:', service);
    });
    
    browser.on('serviceDown', (service) => {
      console.log('Dienst entfernt:', service);
    });
    
    browser.start();
   
    // // Suche nach Geräten im Netzwerk
    // const browser = bonjour.find({ type: "http" }, (service) => {
    //   console.log("Services: ", service);
    //   // Nur ESP32-Geräte berücksichtigen, die nicht in der Datenbank sind
    //   if (service.name.includes("esp32") && !dbControllers.includes(service.referer.address)) {
    //     devices.push({
    //       name: service.name,
    //       address: service.referer.address,
    //       port: service.port,
    //     });
    //   }
    // });
  
    // // // Nach 5 Sekunden die Suche beenden und Ergebnisse zurückgeben
    // setTimeout(() => {
    //   console.log("Timeout, searching stopped");
    //   browser.stop();
  
    //   if (!responseSent) {
    //     if (devices.length > 0) {
    //       const devicesWithIndex = devices.map((device, index) => ({
    //         ...device,
    //         index: index + 1,
    //       }));
    //       res.status(200).json({ serverStatus: 2, devices: devicesWithIndex });
    //     } else {
    //       res.status(404).json({ serverStatus: -1, message: "Keine neuen ESP32-Geräte gefunden" });
    //     }
    //     responseSent = true;
    //   }
    // }, 5000); // Timeout auf 5000 ms

  } catch (error) {
    console.log("Error mDNS: ", error);
  }
};

module.exports.UpdateShelf = async (req, res, db) => {
  const { shelfname, shelfPlace, countCompartment, shelves, shelfid } = req.body;
  
  try {
    // Start der Transaktion
    await new Promise((resolve, reject) => {
      db.run("BEGIN TRANSACTION", (err) => {
        if (err) {
          console.error("Fehler beim Starten der Transaktion:", err);
          reject(new Error("Fehler beim Starten der Transaktion"));
        }
        resolve();
      });
    });

    // 1. Regal aktualisieren
    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE shelf SET shelfname = ?, place = ?, countCompartment = ? WHERE shelfid = ?`,
        [shelfname, shelfPlace, countCompartment, shelfid],
        function (err) {
          if (err) {
            console.error("Fehler beim Aktualisieren des Regals:", err);
            reject(new Error("Fehler beim Aktualisieren des Regals"));
          }
          resolve();
        }
      );
    });

    // 2. Fächer aktualisieren oder neue Fächer hinzufügen
    for (let index = 0; index < shelves.length; index++) {
      const compartment = shelves[index];
      const { compartmentId, height, countLed, startLed, endLed } = compartment;

      // Berechne den Namen und die Nummer des Faches
      const compartmentname = `${index + 1}-Fach`;

      if (compartmentId) {
        // Update bestehender Einträge
        await new Promise((resolve, reject) => {
          db.run(
            `UPDATE compartment SET height = ?, countLed = ?, startLed = ?, endLed = ?, compartmentname = ? WHERE compartmentId = ?`,
            [height, countLed, startLed, endLed, compartmentname, compartmentId],
            function (err) {
              if (err) {
                console.error("Fehler beim Aktualisieren eines Fachs:", err);
                reject(new Error("Fehler beim Aktualisieren eines Fachs"));
              }
              resolve();
            }
          );
        });
      } else {
        // Einfügen neuer Fächer
        await new Promise((resolve, reject) => {
          db.run(
            `INSERT INTO compartment (height, countLed, startLed, endLed, shelfId, compartmentname, number) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [height, countLed, startLed, endLed, shelfid, compartmentname, index + 1],
            function (err) {
              if (err) {
                console.error("Fehler beim Hinzufügen eines neuen Fachs:", err);
                reject(new Error("Fehler beim Hinzufügen eines neuen Fachs"));
              }
              resolve();
            }
          );
        });
      }
    }

    // Wenn alles erfolgreich war, committen der Transaktion
    await new Promise((resolve, reject) => {
      db.run("COMMIT", (err) => {
        if (err) {
          console.error("Fehler beim Commit der Transaktion:", err);
          reject(new Error("Fehler beim Commit der Transaktion"));
        }
        resolve();
      });
    });

    // Erfolgreiche Antwort
    res.status(200).send({ serverStatus: 1 });
  } catch (err) {
    // Im Falle eines Fehlers Rollback der Transaktion und Fehlerantwort
    console.error("Fehler in der UpdateShelf-Funktion:", err);
    await new Promise((resolve, reject) => {
      db.run("ROLLBACK", (err) => {
        if (err) {
          console.error("Fehler beim Rollback der Transaktion:", err);
          reject(new Error("Fehler beim Rollback der Transaktion"));
        }
        resolve();
      });
    });
    res.status(500).send({ message: err });
  }
};

const CreateCompartments = (db, countCompartment, shelfId, shelves) => {
  db.serialize(() => {
    db.run("BEGIN TRANSACTION", (err) => {
      if (err) {
        console.error("Fehler beim Starten der Transaktion:", err);
      }
    });

    const promises = [];

    for (let i = 0; i < countCompartment; i++) {
      const compartmentName = `${i + 1}-Fach`;

      // Zugriff auf das richtige Shelf-Objekt basierend auf der Indexposition
      const currentShelf = shelves[i];
      if (!currentShelf) {
        console.error(`Kein Shelf für Index ${i} gefunden!`);
        continue; // Falls kein Shelf gefunden wird, überspringen
      }

      const promise = new Promise((resolve, reject) => {
        db.get(
          `SELECT COUNT(*) AS count FROM compartment WHERE compartmentname = ? AND shelfid = ?`,
          [compartmentName, shelfId],
          (err, row) => {
            if (err) {
              return reject(err);
            }

            if (row.count === 0) {             
              db.run(
                `INSERT INTO compartment (compartmentname, shelfid, number, countLed, startLed, endLed, height) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                  compartmentName,
                  shelfId,
                  i + 1,
                  currentShelf.leds,
                  currentShelf.startLED,
                  currentShelf.endLED,
                  currentShelf.height,
                ],
                (err) => {
                  if (err) {
                    return reject(err);
                  }
                  resolve();
                }
              );
            } else {
              resolve();
            }
          }
        );
      });
      promises.push(promise);
    }

    Promise.all(promises)
      .then(() => {
        db.run("COMMIT", (err) => {
          if (err) {
            console.error("Fehler beim Commit der Transaktion:", err);
          } else {
            console.log("Transaktion erfolgreich abgeschlossen.");
          }
        });
      })
      .catch((error) => {
        console.error("Fehler beim Erstellen der Fächer:", error);
        db.run("ROLLBACK", (err) => {
          if (err) {
            console.error("Fehler beim Rollback der Transaktion:", err);
          }
        });
      });
  });
};

const CreateControllerFunction = async (db, res, countCompartment) => {
  try {
    const controllerId = await GetLastInsertRowId(db);

    await InsertControllerFunction(db, controllerId, countCompartment);

  } catch (error) {
    console.error(error);
  }
};
const GetLastInsertRowId = (db) => {
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
// const GetCompartments = (db, shelf) => {
//   return new Promise((resolve, reject) => {
//     db.all(
//       `SELECT compartment.*
//       FROM compartment
//       LEFT JOIN article ON article.compartment = compartment.compartmentId
//       WHERE compartment.shelfId = ? AND article.compartment IS NULL`,
//       [shelf],
//       (err, result) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(result);
//         }
//       }
//     );
//   });
// };
const DeleteControllerFunction = async (db, deviceId) => {
  try {
    await db.all(`DELETE FROM ControllerFunctions WHERE controllerId =?`, [
      deviceId,
    ]);
  } catch (error) {
    console.log(error);
  }
};
const InsertControllerFunction = async (db, controllerId, countCompartment) => {
  try {
    for (let i = 0; i < countCompartment; i++) {
      await db.run(
      `INSERT INTO ControllerFunctions (controllerId, functionName ) VALUES (?,?)`,
      [controllerId, "led" + (i + 1) + "/on"]
      );
    }
    // Led off controllerFunction
    await db.run(
      `INSERT INTO ControllerFunctions (controllerId, functionName) VALUES (?,?)`,
      [controllerId, "led/off"]
    );
  } catch (error) {
    console.log("Fehler beim einfügen von Controllerfunktion: ", error);
  }
  
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
// const GetControllerFunctions = (database, controllerId) => {
//   return new Promise((resolve, reject) => {
//     database.all(`SELECT * FROM ControllerFunctions WHERE controllerId = ?`, [controllerId], (err, result) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(result);
//       }
//     });
//   });
// };
