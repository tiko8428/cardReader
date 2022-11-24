const express = require('express');
const bodyParser = require('body-parser');
const Realm = require('realm');
const path = require("path");
// const preDb = require("./German-Cards.realm");
// var app = express();

// TO DO
/*  
  A1      A2     B1-1  B1-2  B2 C1
  A1-uk   A2-uk
  A1-ru   A2-ru
*/

/*
 edit   
 from image 
 edit
*/

const German_Cards_Schema = {
  name: 'Card',
  properties: {
    id: 'string?',
    cardNumber: 'string?',
    name: 'string?', // field1
    plural: 'string?',// fealsd2
    secondary: 'string?', // fealsd3
    example: 'string?',// fealsd4
    category: 'string?',
    systemImageName: 'string?' // imageName
    //fealsd5 
    // fealsd6
  }
};

const Ukrainian_Cards_Schema = {
  name: 'Card',
  properties: {
    id: 'string?',
    cardNumber: 'string?',
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
