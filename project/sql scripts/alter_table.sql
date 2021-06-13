
-- ALTER TABLE matches
-- ADD referee int;

-- ALTER TABLE referee
-- DROP COLUMN Name;

-- ALTER TABLE referee
-- ADD name [varchar](300);

-- INSERT INTO referee
-- 	(name)
-- VALUES
-- 	('Erez');

-- DELETE FROM referee WHERE referee_id = 3;

ALTER TABLE matches
ADD CONSTRAINT refereeD
DEFAULT NULL FOR referee;

ALTER TABLE users
ADD CONSTRAINT username_unique UNIQUE (username);

DELETE FROM users WHERE user_id = 41;
DELETE FROM matches WHERE match_id = 24;

DELETE FROM eventbook WHERE eventbook_id = 7;
UPDATE dbo.eventbook SET gamemin = 15 WHERE eventbook_id = 20;

ALTER TABLE favorits
ADD CONSTRAINT favorites_unique UNIQUE (user_id,match_id);