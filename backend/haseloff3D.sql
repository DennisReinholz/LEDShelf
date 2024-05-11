INSERT INTO ledController (ipAdresse,shelfid, numberCompartment) VALUES ("192.168.188.48",45,6)

DROP TABLE ControllerFunctions

CREATE TABLE ControllerFunctions (
    controllerfunctionId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    controllerId INT,
    functionName VARCHAR(255)
);

INSERT INTO ControllerFunctions (controllerId, functionName) VALUES(1,"led/off")

ALTER TABLE ControllerFunctions
ADD compartmentid int;

UPDATE ledController
SET ipAdresse = "172.20.10.2"
WHERE ledControllerid = 1


SELECT cf.functionName, cf.compartmentid, lc.ipAdresse, c.compartmentname from Controllerfunctions cf, ledcontroller lc, compartment c, shelf
WHERE lc.shelfid = shelf.shelfid and c.shelfId = shelf.shelfid and c.compartmentId = cf.compartmentid and c.compartmentid = 309