// mongo-init.js
db = db.getSiblingDB('api_db');

db.createCollection("players");
db.createCollection("games");

