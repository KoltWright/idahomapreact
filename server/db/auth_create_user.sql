INSERT INTO helo_users
(auth0_id)
VALUES (${auth_id});

SELECT id FROM helo_users
WHERE auth0_id = ${auth_id};
