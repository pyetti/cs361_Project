SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 ;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 ;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' ;
SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 ;


CREATE TABLE IF NOT EXISTS `users` (
`id` int NOT NULL AUTO_INCREMENT,
`username` varchar(255) NOT NULL UNIQUE,
`email` varchar(255) NOT NULL UNIQUE,
`password` varchar(255) NOT NULL,
`zipcode` int(11) NOT NULL,
`party` varchar(255),
`reminders` boolean NOT NULL default 1,
`newsletter` boolean NOT NULL default 1,    
PRIMARY KEY(`id`)
)ENGINE = InnoDB DEFAULT CHARSET=utf8;



INSERT INTO `users` (`username`, `email`, `password`, `zipcode`, `party`, `reminders`, `newsletter`)
VALUES ('Snoopy', 'voter.info.cs361@gmail.com', 'guest', '99901', 'Independent', 1, 1);

INSERT INTO `users` (`username`, `email`, `password`, `zipcode`, `party`, `reminders`, `newsletter`) VALUES (?, ?, ?, ?, ?, 1, 1)

