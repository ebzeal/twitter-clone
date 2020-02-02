 echo "Setting up twitter_clone"

 dropdb -h localhost -p 5432 --if-exists -U postgres "twitter_clone"
 createdb -h localhost -p 5432 -U postgres "twitter_clone"
 
 psql twitter_clone -U postgres < ./api/models/dbMigrationAndSeeder.sql

 echo "$database completed"
