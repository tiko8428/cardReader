const express = require('express');
const bodyParser = require('body-parser');
const Realm = require('realm');
const path = require("path");
// const preDb = require("./German-Cards.realm");
// var app = express();

const CardSchema = {
  name: 'Card',
  primaryKey: 'id',
  // schemaVersion: 0,
  properties: {
    id: "string", // key 
    cardNumber: 'string',
    language: 'string',
    name: 'string',
    plural: 'string',
    secondary: 'string?',
    example: "string",
    category: "string",
    systemImageName: "string?",
  }
};

const dbPath =path.join(__dirname + "/db/Cards.realm") ;

const cardDB = new Realm({
    path: dbPath,
    schema: [CardSchema]
  });

// const cardDB = new Realm({
//   path: 'card.realm',
//   schema: [CardSchema]
// });
// const t = cardDB.getSchema()
// console.log(t);
// .remove(className);

module.exports = cardDB;