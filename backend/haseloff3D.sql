CREATE TABLE ledController (
    ledControllerid INTEGER PRIMARY KEY AUTOINCREMENT,
    ipAdresse VARCHAR(255) NOT NULL,
    shelfid INT,
    numberCompartment INT,
    status VARCHAR(255)  
  
);

SELECT compartment.* FROM shelf,compartment WHERE shelf.shelfid = compartment.shelfId

SELECT shelf.shelfid, shelf.shelfname, compartment.compartmentname, article.articlename, article.count, article.compartment FROM shelf, article, compartment WHERE shelf.shelfid = 25 AND shelf.compartment.shelfId AND article.compartment = compartment.number

update compartment set number = 5 Where compartmentid = 11

SELECT shelf.shelfid, shelf.shelfname, compartment.compartmentname
    FROM shelf 
    JOIN compartment ON shelf.shelfid = compartment.shelfId 
    WHERE shelf.shelfid = 41 

SELECT * FROM article


SELECT article.*, shelf.shelfname FROM article, shelf WHERE article.shelf=shelf.shelfid


SELECT article.*, shelf.shelfname 
FROM article 
LEFT JOIN shelf ON article.shelf = shelf.shelfid;

SELECT * from user

SELECT shelf.shelfid, shelf.shelfname, compartment.compartmentname, compartment.number, compartmentId
    FROM shelf 
    JOIN compartment ON shelf.shelfid = compartment.shelfId 
    JOIN article ON compartment.compartmentId = article.compartment
    WHERE shelf.shelfid = 26

    SELECT * from article WHERE compartment =41


    SELECT article.*, shelf.shelfname, compartment.compartmentname 
    FROM article, compartment 
    LEFT JOIN shelf ON article.shelf = shelf.shelfid
    WHERE article.compartment = compartment.compartmentId