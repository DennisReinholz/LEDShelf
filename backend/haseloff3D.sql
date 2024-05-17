SELECT cf.functionName, cf.compartmentid, lc.ipAdresse, c.compartmentname from Controllerfunctions cf, ledcontroller lc, compartment c, shelf
  WHERE lc.shelfid = shelf.shelfid and c.shelfId = shelf.shelfid and c.compartmentId = cf.compartmentid and c.compartmentid IS NULL


  ALTER TABLE article add  commission varchar(255)



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