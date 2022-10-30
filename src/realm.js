const express = require('express');
const bodyParser = require('body-parser');
const Realm = require('realm');
const path = require("path");
// const preDb = require("./German-Cards.realm");
// var app = express();

const German_Cards_Schema = {
  name: 'Card',
  properties: {
    id: 'string?',
    cardNumber: 'int?',
    name: 'string?',
    plural: 'string?',
    secondary: 'string?',
    example: 'string?',
    category: 'string?',
    systemImageName: 'string?'
  }
};

const Ukrainian_Cards_Schema = {
  name: 'Card',
  properties: {
    id: 'string?',
    cardNumber: 'int?',
    name: 'string?',
    plural: 'string?',
    secondary: 'string?',
    example: 'string?',
    category: 'string?',
    systemImageName: 'string?'
  }
};

const German_Cards_Path = path.join(__dirname + "/db/German-Cards.realm") ;
const Ukrainian_Cards_Path = path.join(__dirname + "/db/Ukrainian-Cards.realm") ;

const German_Cards = new Realm({
    path: German_Cards_Path,
    schema: [German_Cards_Schema]
  });
  

const Ukrainian_Cards = new Realm({
  path: Ukrainian_Cards_Path,
  schema: [Ukrainian_Cards_Schema]
});

module.exports = {
  German_Cards:German_Cards,
   Ukrainian_Cards: Ukrainian_Cards 
  };