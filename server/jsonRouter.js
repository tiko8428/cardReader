const express = require("express");
const helper = require("./hellper");
const url = require("url");


const jsonRoutes = express.Router();

const langs = ["de", "en", "ru", "ua"];

// jsonRoutes.get("/all", async (req, res) => {
//   const data = {};

//   langs.forEach(lang => {
//     const currentData = helper.readJsonFile(lang);
//     data[lang] = currentData;
//   })

//   res.send(JSON.stringify(data));
// })

jsonRoutes.get("/by-lang", (req, res) => {
  const queryObject = url.parse(req.url, true).query
  if (queryObject.lang) {
    const currentLanguage = helper.readJsonFile(queryObject.lang);
    res.send({ [queryObject.lang]: currentLanguage })
  } else {
    res.status(400)
    res.send({
      status: "error",
      messige: "canat get data",
    });
  }
})

jsonRoutes.get("/get-item", (req, res) => {
  const { cardNumber, lang } = url.parse(req.url, true).query
  if (!cardNumber || !lang) {
    res.status(400);
    res.send({ error: "problem width cardNumber or language" })
    return
  }
  const currentLanguage = helper.readJsonFile(lang);
  const cardNumberArray = Object.keys(currentLanguage);
  if (!cardNumberArray.includes(cardNumber)) {
    res.status(400);
    res.send({ error: " cardNumber do not exist" })
    return
  }
  res.status(200);
  res.send({ ...currentLanguage[cardNumber] })
})


jsonRoutes.post("/newRow", (req, res) => {
  const { language, row } = req.body.body;

  if (!language || !row) {
    res.status(400);
    res.send({ error: "do not have languge or row" });
  }
  const cardNumber = row.cardNumber
  const currentLanguage = helper.readJsonFile(language);

  const cardNumberArray = Object.keys(currentLanguage);
  if (!cardNumber || cardNumberArray.includes(cardNumber)) {
    console.error(cardNumber, cardNumberArray);
    res.status(500);
    res.send({ error: "card number orledy exist" });
    return
  };
  const newJson = { ...currentLanguage, [cardNumber]: row };
  helper.saveJson(language, newJson);
  res.send({ success: "success" })
})

jsonRoutes.delete("/delete-row", (req, res) => {
  const queryObject = url.parse(req.url, true).query
  const cardNumber = queryObject.cardNumber;
  const lang = queryObject.lang;
  if (!cardNumber || !lang) {
    res.status(400);
    res.send({ error: "I can't find cardNumber or lang" });
    return;
  }
  const currentLanguage = helper.readJsonFile(lang);
  delete currentLanguage[cardNumber]
  helper.saveJson(lang, currentLanguage);
  res.send({ success: "success" })
})

jsonRoutes.put("/updateRow", (req, res) => {
  const { row, language, oldCardNumber } = req.body.body;
  const cardNumber = row.cardNumber;
  if (!row || !language) {
    res.status(400);
    res.send({ error: "I can't find cardNumber or lang" });
    return;
  }
  const currentLanguage = helper.readJsonFile(language);
  delete currentLanguage[oldCardNumber];
  const newJson = { ...currentLanguage, [cardNumber]: row }
  helper.saveJson(language, newJson);
  res.send({ success: "success" })

})

module.exports = jsonRoutes;