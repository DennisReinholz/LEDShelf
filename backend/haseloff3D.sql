CREATE TABLE company (
    companyId INTEGER PRIMARY KEY AUTOINCREMENT,
    companyName VARCHAR(255),
    street VARCHAR(255),
    plz VARCHAR(255)
);


INSERT INTO company (companyName,street,plz) VALUES ("Tischlerei Haseloff","Liebenwalder Straße 48", "16244")


Update article set company = 2 where articleid=22

SELECT article.*, COALESCE(company.companyName, 'NULL') AS companyName, company.*
FROM article
LEFT JOIN company ON article.company = company.companyId;


SELECT article.*, COALESCE(company.companyName, 'NULL') AS companyName, company.*, shelf.shelfName, compartment.compartmentname
FROM article
LEFT JOIN shelf on article.shelf = shelf.shelfId
LEFT JOIN company ON article.company = company.companyId
LEFT JOIN compartment on article.compartment = compartment.compartmentId


SELECT DISTINCT(compartment.compartmentId), shelf.shelfid, shelf.shelfname, compartment.compartmentname, compartment.number
    FROM shelf
    JOIN compartment ON shelf.shelfid = compartment.shelfId 
    LEFT JOIN article ON compartment.compartmentId = article.compartment
    WHERE shelf.shelfid =45


DELETE FROM ledController WHERE ledControllerid > 1;
DELETE FROM ControllerFunctions WHERE controllerfunctionId > 7;


SELECT ledController.*, shelf.* from ledController, shelf WHERE ledController.shelfid = shelf.shelfid


INSERT INTO ledController (ipAdresse, shelfid, numberCompartment, status) VALUES ("192.162.188.48",46,6,"Connected")

SELECT compartmentId from compartment WHERE shelfId = 45

DELETE FROM controllerFunctions where controllerfunctionId = 68


SELECT cf.*, lc.* FROM ControllerFunctions cf, ledController lc WHERE cf.compartmentid= 319 AND cf.controllerId = lc.ledControllerid


SELECT ledController.*, shelf.*
FROM ledController
LEFT JOIN shelf ON ledController.shelfid = shelf.shelfid
WHERE ledController.shelfid IS NOT NULL
   OR ledController.shelfid IS NULL;


INSERT INTO user (username, password, role) VALUES ("Admin", "test",1)
