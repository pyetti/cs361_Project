SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 ;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 ;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' ;
SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 ;

--
-- Database: cs361_realeb
--

-- Table structure for table locations
CREATE TABLE IF NOT EXISTS locations (
	location_id int(11) NOT NULL AUTO_INCREMENT,
	city varchar(50) NOT NULL,
	state varchar(50) NOT NULL,
	zipcode varchar(5) NOT NULL,
	PRIMARY KEY (location_id),
	CONSTRAINT unique_constraint UNIQUE (city, state, zipcode)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO locations (city, state, zipcode)
VALUES ('Montebello', 'California', '90640');


-- Table structure for table elections
CREATE TABLE IF NOT EXISTS elections (
	election_id int(11) NOT NULL AUTO_INCREMENT,
	title varchar(50) NOT NULL,
	location_id int(11) NOT NULL,
	election_date date NOT NULL,
	PRIMARY KEY (election_id),
	CONSTRAINT fk_elections_location_id FOREIGN KEY (location_id) REFERENCES elections (election_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT unique_constraint UNIQUE (election_id, location_id, election_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO elections (title, location_id, election_date)
VALUES ('City Comptroller', (SELECT location_id FROM locations WHERE city='Montebello' AND state='California' AND zipcode='90640'), '2017-12-05');


-- Table structure for table propositions
CREATE TABLE IF NOT EXISTS propositions (
	proposition_id int(11) NOT NULL AUTO_INCREMENT,
	title varchar(50) NOT NULL,
	description text NOT NULL,
	location_id int(11) NOT NULL,
	date_of_vote date NOT NULL,
	PRIMARY KEY (proposition_id),
	CONSTRAINT fk_props_location_id FOREIGN KEY (location_id) REFERENCES elections (election_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO propositions (title, location_id, description)
VALUES ('Measure T: Montebello Term Limits', (SELECT location_id FROM locations WHERE city='Montebello' AND state='California' AND zipcode='90640'), 'Shall the terms served by elected officials of the City of Montebello, including members of the City Council, the City Treasurer, and the City Clerk, be limited to not more than three (3) consecutive four (4) year terms, after which an elected official shall not be qualified to serve in that elected office for a period of four (4) years?');


-- Table structure for table candidates
CREATE TABLE IF NOT EXISTS candidates (
	candidate_id int(11) NOT NULL AUTO_INCREMENT,
	first_name varchar(50) NOT NULL,
	last_name varchar(50) NOT NULL,
	election_id int(11) NOT NULL,
	PRIMARY KEY (candidate_id),
	CONSTRAINT fk_c_election_id FOREIGN KEY (election_id) REFERENCES elections (election_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO candidates (first_name, last_name, election_id)
VALUES 	('Joe', 'Smith', (SELECT e.election_id FROM elections e JOIN locations l ON e.location_id = l.location_id WHERE title='City Comptroller' AND city='Montebello' AND state='California' AND zipcode='90640' AND election_date='2017-12-05')),
		('Fred', 'Thompson', (SELECT e.election_id FROM elections e JOIN locations l ON e.location_id = l.location_id WHERE title='City Comptroller' AND city='Montebello' AND state='California' AND zipcode='90640' AND election_date='2017-12-05'));
































