DROP TABLE IF EXISTS users, tweets, tags, replies, follows, userProfile;

   CREATE TABLE IF NOT EXISTS
        users(
        id SERIAL PRIMARY KEY,
        email VARCHAR(128),
        userName VARCHAR(128),
        phone VARCHAR(128),
        password VARCHAR(500),
        dateCreated DATE NOT NULL DEFAULT CURRENT_DATE
      );


   CREATE TABLE IF NOT EXISTS
        tweets(
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        tweet VARCHAR(280),
        image VARCHAR(128),
        dateCreated DATE NOT NULL DEFAULT CURRENT_DATE
      );
      

CREATE TABLE IF NOT EXISTS
      tags(
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        tweet_id INTEGER REFERENCES tweets(id) ON DELETE CASCADE,
        tag VARCHAR(128),
        dateCreated DATE NOT NULL DEFAULT CURRENT_DATE
      );

CREATE TABLE IF NOT EXISTS
      replies(
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        tweet_id INTEGER REFERENCES tweets(id) ON DELETE CASCADE,
        tweet_reply VARCHAR(280),
        dateAdded DATE NOT NULL DEFAULT CURRENT_DATE
      );

CREATE TABLE IF NOT EXISTS
      follows(
        id SERIAL PRIMARY KEY,
        follower_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        following_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        dateAdded DATE NOT NULL DEFAULT CURRENT_DATE
      );

CREATE TABLE IF NOT EXISTS
      userProfile(
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(50),
        bio VARCHAR(160),
        location VARCHAR(30),
        website VARCHAR(100),
        date_of_birth DATE,
        dateAdded DATE NOT NULL DEFAULT CURRENT_DATE
      );


INSERT INTO users (email, userName, phone, password)VALUES('olu@me.com','olu','+2348080994031','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInVzZXJFbWFpbCI6Im9sdUBtZS5jb20iLCJhY2Nlc3MiOiJBZG1pbiIsImlhdCI6MTU4MDI5OTY4NiwiZXhwIjoxNjQzMzcxNjg2fQ.DEvUL4rmTthxLqAkH4rIYAKEvJQ9CyLkabMrXogyBzg'),('bar@ney.com', 'barney', '+2348037508581', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsInVzZXJFbWFpbCI6ImJhckBuZXkuY29tIiwiYWNjZXNzIjoiVXNlciIsImlhdCI6MTU4MDI5OTc5MCwiZXhwIjoxNjQzMzcxNzkwfQ.4hn40LrFiOt6Gmyoj1b8sbXuAYA-aICneob4jDJCVEQ');

INSERT INTO tweets(user_id, tweet, image)VALUES(1,'A Private asked him for a lighter to use for his cigarette by mistake. The Private was shocked to discover it was the legendary General. He told the Private..."It is alright son, just don''t try that with a second lieutenant." Generals don''t care as much as second lieutenants.', 'image'),(2,'my work uses yarn and some of my projects use npm and I''m too lazy to remember which to use. please someone make a cli that runs one or the other based on if package-lock.json or yarn.lock exists and accepts both commands (e.g. both "add" and "install")

you can call it "nyan"','image'),(2,'🤣🤣🤣🤣. Try and learn Remi alukos songs , it helps in extreme situations. Even if you remove your shirt in places like fadeyi and ojuwoye /mushin, boys go still mug you oh. You have to sing ajelas song with a sachet gin in your mouth to walk through. 🤣🤣', 'image'),(1, 'Without keyboard shortcuts I end up writing:

import Raect from ''reeacqkt''', 'image');

INSERT INTO tags(user_id, tweet_id, tag)VALUES(1,1,'#motivational'),(1,1,'#leadership'),(1,1,'#emotionalintelligence'),(2, 2, '#yarn'),(2, 2, '#npm'),(2,3,'#mushin'),(2,3,'#LagosMadness');

INSERT INTO replies(user_id, tweet_id, tweet_reply)VALUES(1,2,'If somebody created such a tool, then someone else would also copy it (to make a supposedly better one) and both would end up in use.

Every generation wants to reinvent their own tools, so now web dev stacks are a train-wreck. Like low-orbit space-junk: Ever-present+ever-growing'),(1,2,'This is purrrrfect');

INSERT INTO follows(follower_id, following_id)VALUES(1, 2);
