
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

DELETE FROM eventbook WHERE eventbook_id = 7;
