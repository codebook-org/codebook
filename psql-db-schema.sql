CREATE TABLE IF NOT EXISTS Users (
    user_id       INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username      VARCHAR(25)  UNIQUE NOT NULL,
    email         VARCHAR(255) UNIQUE,
    password_hash TEXT         NOT NULL,
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
    -- Only works with MySQL, no built-in PostgreSQL equivalent, would have to write triggers
    -- updated_at    TIMESTAMP    NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    display_name  VARCHAR(25),
    bio           TEXT,
    creation_ids  INT[]
);

CREATE TABLE IF NOT EXISTS Problems (
    problem_id            INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title                 VARCHAR(255) NOT NULL,
    description           TEXT NOT NULL,
    user_id               INT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS TestCases (
    testcase_id              INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    problem_id               INT NOT NULL,
    FOREIGN KEY (problem_id) REFERENCES Problems(problem_id) ON DELETE CASCADE ON UPDATE CASCADE,
    input                    TEXT NOT NULL,
    expected_out              TEXT NOT NULL
);

-- Default Problems, add if "missing"/not enough problems in table
INSERT INTO Problems (title, description)
SELECT 'N-Queens', 'Default DB Init Problem #1: N-Queens'
WHERE (SELECT COUNT(*) FROM Problems) < 1;
INSERT INTO Problems (title, description)
SELECT 'Two Sum', 'Default DB Init Problem #2: Two Sum'
WHERE (SELECT COUNT(*) FROM Problems) < 2;
-- Default Test Cases (for testing)
INSERT INTO TestCases (problem_id, input, expected_out)
SELECT * FROM (
    VALUES
        (1, '1', '2'),
        (1, '2', '4'),
        (2, '1', '2'),
        (2, '2', '4')
) AS new_rows(problem_id, input, expected_out)
WHERE (SELECT COUNT(*) FROM TestCases) < 4;