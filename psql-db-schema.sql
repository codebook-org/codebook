-- CITEXT: Case-Insensitive TEXT
CREATE EXTENSION IF NOT EXISTS citext SCHEMA public;

------------
-- TABLES --
------------

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
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON UPDATE CASCADE,
    like_count            INT NOT NULL DEFAULT 0,
    dislike_count         INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS problem_votes (
    user_id    INT NOT NULL REFERENCES users(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    problem_id INT NOT NULL REFERENCES problems(problem_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    is_like    BOOLEAN NOT NULL,
    
    PRIMARY KEY (user_id, problem_id)
);
-- Fast lookup times, write operations are a bit heavier, but that's fine.
CREATE INDEX idx_problem_votes_user_id ON problem_votes(user_id);
CREATE INDEX idx_problem_votes_problem_id ON problem_votes(problem_id);

CREATE TABLE IF NOT EXISTS testcases (
    testcase_id              INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    problem_id               INT NOT NULL,
    FOREIGN KEY (problem_id) REFERENCES Problems(problem_id) ON DELETE CASCADE ON UPDATE CASCADE,
    input                    TEXT NOT NULL,
    expected_out             TEXT NOT NULL,
    visible                  BOOLEAN NOT NULL
);

---------------
-- FUNCTIONS --
---------------

CREATE OR REPLACE FUNCTION update_problem_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
    -- Handle INSERT (new vote)
    IF TG_OP = 'INSERT' THEN
        IF NEW.is_like THEN
            UPDATE problems
            SET like_count = like_count + 1
            WHERE problem_id = NEW.problem_id;
        ELSE
            UPDATE problems
            SET dislike_count = dislike_count + 1
            WHERE problem_id = NEW.problem_id;
        END IF;

        RETURN NEW;
    END IF;

    -- Handle DELETE (vote removed)
    IF TG_OP = 'DELETE' THEN
        IF OLD.is_like THEN
            UPDATE problems
            SET like_count = like_count - 1
            WHERE problem_id = OLD.problem_id;
        ELSE
            UPDATE problems
            SET dislike_count = dislike_count - 1
            WHERE problem_id = OLD.problem_id;
        END IF;

        RETURN OLD;
    END IF;

    -- Handle UPDATE (vote changed or problem_id changed)
    IF TG_OP = 'UPDATE' THEN

        -- If problem_id changed, remove from old problem
        IF OLD.problem_id <> NEW.problem_id THEN
            IF OLD.is_like THEN
                UPDATE problems
                SET like_count = like_count - 1
                WHERE problem_id = OLD.problem_id;
            ELSE
                UPDATE problems
                SET dislike_count = dislike_count - 1
                WHERE problem_id = OLD.problem_id;
            END IF;

            -- Add to new problem
            IF NEW.is_like THEN
                UPDATE problems
                SET like_count = like_count + 1
                WHERE problem_id = NEW.problem_id;
            ELSE
                UPDATE problems
                SET dislike_count = dislike_count + 1
                WHERE problem_id = NEW.problem_id;
            END IF;

        ELSE
            -- Same problem_id, but vote type changed
            IF OLD.is_like <> NEW.is_like THEN
                IF OLD.is_like THEN
                    UPDATE problems
                    SET like_count = like_count - 1,
                        dislike_count = dislike_count + 1
                    WHERE problem_id = NEW.problem_id;
                ELSE
                    UPDATE problems
                    SET dislike_count = dislike_count - 1,
                        like_count = like_count + 1
                    WHERE problem_id = NEW.problem_id;
                END IF;
            END IF;
        END IF;

        RETURN NEW;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

--------------
-- TRIGGERS --
--------------

CREATE TRIGGER problem_votes_count_trigger
AFTER INSERT OR UPDATE OR DELETE ON problem_votes
FOR EACH ROW EXECUTE FUNCTION update_problem_vote_counts();

--------------------
-- Default Values --
--------------------

-- Default Users
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
