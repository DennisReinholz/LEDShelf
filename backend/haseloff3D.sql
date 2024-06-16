SELECT cf.functionName, cf.compartmentid, lc.ipAdresse, c.compartmentname from Controllerfunctions cf, ledcontroller lc, compartment c, shelf
  WHERE lc.shelfid = shelf.shelfid and c.shelfId = shelf.shelfid and c.compartmentId = cf.compartmentid and c.compartmentid IS NULL


  ALTER TABLE article add  commission varchar(255)

DELETE FROM user WHERE user.userid = 19;

  SELECT functionName, ledController.ipAdresse 
  FROM shelf, ledController, ControllerFunctions 
  WHERE 
  shelf.shelfid =45 AND
  shelf.controllerId = ledController.ledControllerid AND 
  ControllerFunctions.controllerId = ledController.ledControllerid AND 
  compartmentid IS NULL

SELECT shelf.shelfid, shelf.shelfname, compartment.compartmentname, compartment.number, compartmentId
FROM shelf
JOIN compartment ON shelf.shelfid = compartment.shelfId 
LEFT JOIN article ON compartment.compartmentId = article.compartment
WHERE (article.compartment IS NULL OR article.compartment = '') AND shelf.shelfid = 46;


SELECT shelf.shelfid, shelf.shelfname, compartment.compartmentname, compartment.number, compartmentId
    FROM shelf
    JOIN compartment ON shelf.shelfid = compartment.shelfId 
    LEFT JOIN article ON compartment.compartmentId = article.compartment
    WHERE (article.compartment IS NULL OR article.compartment = '') AND shelf.shelfid = 46


SELECT article.*, shelf.shelfname, compartment.compartmentname 
    FROM article, compartment 
    LEFT JOIN shelf ON article.shelf = shelf.shelfid
    WHERE article.compartment = compartment.compartmentId


SELECT 
   * 
FROM 
    article
    LEFT JOIN compartment ON article.compartment = compartment.compartmentId
    LEFT JOIN shelf ON article.shelf = shelf.shelfid;

SELECT * from article


    UPDATE article SET count=5,unit="Meter",compartment=311,shelf=45,categoryid=18 WHERE articleid=28


SELECT * from article WHERE article.categoryid = 13 or article.categoryid LIKE "null"

SELECT * from article WHERE categoryid ="null" or categoryid ISNULL or categoryid =13

update article set categoryid = null WHERE articleid = 30