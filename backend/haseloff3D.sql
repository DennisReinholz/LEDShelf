ALTER TABLE article ADD minRequiment int

ALTER TABLE article
RENAME COLUMN minRequiment to minRequirement;


INSERT INTO article (articlename,count, minRequirement) VALUES ("test3",10,5)

SELECT 
   * 
FROM 
    article
    LEFT JOIN compartment ON article.compartment = compartment.compartmentId
    LEFT JOIN shelf ON article.shelf = shelf.shelfid