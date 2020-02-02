 echo "Setting up twitter_clone_test"

 dropdb -h localhost -p 5432 --if-exists -U postgres "twitter_clone_test"
 createdb -h localhost -p 5432 -U postgres "twitter_clone_test"
 
 psql twitter_clone_test -U postgres < ./api/models/testDbMigrationAndSeeder.sql

 echo "$database completed"
