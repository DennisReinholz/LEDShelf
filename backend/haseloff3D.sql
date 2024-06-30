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