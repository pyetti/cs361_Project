SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 ;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 ;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' ;
SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 ;




CREATE TABLE IF NOT EXISTS useraccount (
	user_id int(11) NOT NULL AUTO_INCREMENT,
	username varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	password varchar(32) NOT NULL,
	zipcode int(32) NOT NULL,
    party varchar(32) NOT NULL,
    reminder boolean(1) NOT NULL,
    newsletter boolean(1) NOT NULL,

	PRIMARY KEY (user_id),
	CONSTRAINT unique_constraint UNIQUE (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;