const  mongoose  = require("mongoose");
mongoose.Promise  = require("bluebird");

// Why so
const  url  =  "mongodb://localhost:27017/chat";
const  connect  =  mongoose.connect(url, { useNewUrlParser: true  });
module.exports  =  connect;


/*
Some useful commands on mac

1) Start, stop database
brew services stop/start mongodb-community@4.4

2) To delete database contents

show dbs
use <db_name>
db .dropDatabase()
*/