CREATE TABLE(id SERIAL PRIMARY KEY,author VARCHAR(50) REFERENCES users(name),postid int REFERENCES posts(id),body TEXT NOT NULL);