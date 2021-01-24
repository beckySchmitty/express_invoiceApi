\c biztime

DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies;

CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.');

INSERT INTO invoices (comp_Code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null);




-- -- additional tables added for users and messages practice
-- DROP TABLE IF EXISTS users
-- CASCADE;
-- DROP TABLE IF EXISTS messages
-- CASCADE;
-- DROP TABLE IF EXISTS tags
-- CASCADE;
-- DROP TABLE IF EXISTS messages_tags
-- CASCADE;

-- CREATE TABLE users
-- (
--   id SERIAL PRIMARY KEY,
--   name TEXT NOT NULL,
--   type TEXT NOT NULL
-- );

-- CREATE TABLE messages
-- (
--   id SERIAL PRIMARY KEY,
--   user_id INTEGER NOT NULL REFERENCES users,
--   msg TEXT NOT NULL
-- );

-- CREATE TABLE tags
-- (
--   code TEXT PRIMARY KEY,
--   tag TEXT UNIQUE
-- );

-- CREATE TABLE messages_tags
-- (
--   message_id INTEGER NOT NULL REFERENCES messages,
--   tag_code TEXT NOT NULL REFERENCES tags,
--   PRIMARY KEY(message_id, tag_code)
-- );

-- INSERT INTO users
--   (name, type)
-- VALUES
--   ('Juanita', 'admin');
-- INSERT INTO users
--   (name, type)
-- VALUES
--   ('Jenny', 'staff');
-- INSERT INTO users
--   (name, type)
-- VALUES
--   ('Jeff', 'user');

-- INSERT INTO messages
--   (user_id, msg)
-- VALUES
--   (1, 'Help me with my coding interview!'),
--   (1, 'Common JS Mistakes'),
--   (2, 'My new flask+react project');

-- INSERT INTO tags
-- VALUES
--   ('py', 'Python'),
--   ('js', 'JavaScript');

-- INSERT INTO messages_tags
-- VALUES
--   (1, 'py'),
--   (1, 'js'),
--   (2, 'js'),
--   (3, 'js'),
--   (3, 'py');
