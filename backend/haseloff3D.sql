CREATE TABLE article (
    articleid INTEGER PRIMARY KEY AUTOINCREMENT,
    articlename VARCHAR(255) NOT NULL,
    count INT,
    compartment INT,
    shelf INT
);

INSERT INTO article (articlename, count,compartment, shelf) Values ("Unterlegscheibe",100 ,2,1)
