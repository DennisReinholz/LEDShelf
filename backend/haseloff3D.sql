CREATE TABLE compartment (
    compartmentId INTEGER PRIMARY KEY AUTOINCREMENT,
    compartmentname VARCHAR(255) NOT NULL, 
    articleId int,  
    shelfId INT
);

SELECT compartment.*FROM shelf,compartment WHERE shelf.shelfid = compartment.shelfId
