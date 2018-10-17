@ECHO OFF
start cmd /C mongod
set PORT=4004
set NODE_ENV=development
set SECRET_KEY=gOGRaM$SEa$2223344
nodemon server.js