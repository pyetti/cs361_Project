SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 ;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 ;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' ;
SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 ;





CREATE TABLE IF NOT EXISTS useraccount (
	uid INT PRIMARY KEY AUTO_INCREMENT,
	username varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	party varchar(32) NOT NULL,
	password varchar(32) NOT NULL,
	password2 varchar(32) NOT NULL,
	zipcode int(32) NOT NULL,
    reminder boolean NOT NULL,
    newsletter boolean NOT NULL,
	CONSTRAINT unique_constraint UNIQUE (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO useraccount (username, email, party, password, password2, zipcode,  reminder, newsletter)
VALUES ('Snoopy', 'voter.info.cs361@gmail.com', 'independant', 'guest', 'guest',  99901, 1, 1);

INSERT INTO useraccount (username, email, password, password2, zipcode, party, reminder, newsletter) values (?, ?, ?, ?, ?, ?, ?, ?)

