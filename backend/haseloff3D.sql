ALTER TABLE article ADD minRequiment int

ALTER TABLE article
RENAME COLUMN minRequiment to minRequirement;


INSERT INTO article (articlename,count, minRequirement) VALUES ("test3",10,5)