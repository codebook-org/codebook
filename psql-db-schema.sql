-- CITEXT: Case-Insensitive TEXT
CREATE EXTENSION IF NOT EXISTS citext SCHEMA public;

CREATE TABLE IF NOT EXISTS users (
    user_id         INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username        CITEXT UNIQUE NOT NULL,
    email           CITEXT UNIQUE,
    password_hash   TEXT,
    google_oauth_id TEXT UNIQUE,
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    -- Only works with MySQL, no built-in PostgreSQL equivalent, would have to write triggers
    -- updated_at    TIMESTAMP    NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    display_name    VARCHAR(25),
    bio             TEXT,
    creation_ids    INT[]
);

CREATE TABLE IF NOT EXISTS problems (
    problem_id            INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title                 VARCHAR(255) NOT NULL,
    description           TEXT NOT NULL,
    user_id               INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS testcases (
    testcase_id              INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    problem_id               INT NOT NULL,
    FOREIGN KEY (problem_id) REFERENCES Problems(problem_id) ON DELETE CASCADE ON UPDATE CASCADE,
    input                    TEXT NOT NULL,
    expected_out             TEXT NOT NULL,
    visible                  BOOLEAN NOT NULL
);

INSERT INTO users (username, email, password_hash)
VALUES('admin', 'test@test.test', 'bluhbluhbluh') ON CONFLICT DO NOTHING;
INSERT INTO users (username, google_oauth_id)
VALUES('googleOauthAdmin', 'iamtheadmin') ON CONFLICT DO NOTHING;
-- Default Problems, add if "missing"/not enough problems in table
INSERT INTO problems (title, description)
SELECT 'Double Number', 'Input: a single integer -- n\nOutput: twice the value of n'
WHERE (SELECT COUNT(*) FROM problems) < 1;
INSERT INTO problems (title, description)
SELECT 'Triple Number', 'Input: a single integer -- n\nOutput: three times the value of n'
WHERE (SELECT COUNT(*) FROM problems) < 2;
-- Default Test Cases (for testing)
INSERT INTO testcases (problem_id, input, expected_out, visible)
SELECT * FROM (
    VALUES
        (1, '1', '2', TRUE),
        (1, '2', '4', TRUE),
        (1, '500', '1000', FALSE),
        (2, '1', '3', TRUE),
        (2, '2', '6', TRUE),
        (2, '333', '999', FALSE)
) AS new_rows(problem_id, input, expected_out)
WHERE (SELECT COUNT(*) FROM testcases) < 4;