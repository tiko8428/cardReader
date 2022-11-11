const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const uuid = require("uuid");
const url = require("url");

const vision = require("@google-cloud/vision");
const router = require("./server/router");

const fileUpload = require("express-fileupload");

const db = require("./src/realm");

const uk_db = db.Ukrainian_Cards;
const de_db = db.German_Cards;

const CREDANTIOLS = JSON.parse(
  JSON.stringify({
    type: "service_account",
    project_id: "test-image-api-358416",
    private_key_id: "502315b893ea2b62e7ec67991ad062f01f08aedd",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC6NEp3X+mRRHkF\nm0gdXeK2489LzR/AqqwnWSvXFuxHZqtvL4dp3lABvcUq3setKldGuQwvmvY+EIBt\nD9AGLzNJjjOHJnGaeLtnPQaFmw+Wv+2OB1aBr6T9316u58HDE5e9Yoamw8TcoDyJ\n+KMwvjZvvPRIjnhCcY01v52y2FNgF0OBF7MjTa6WrpKxUFxZeQHLhgcKG+AXNwQX\nz+VK24om14NmCegBT50h0DqA8LMNeyChZU/GkGxyzON3dL5bk2mf6ea/RaG5sHW/\nUE+kW3H+jS9nDjKdSSWi9xOEZinkQgnUWW8WgchtvmCgkUBrDetPJbLbhQQy5gYZ\nHptyPrDPAgMBAAECggEAMf4TFizSnVV4dqhjurq3wWm1gMEAau6HzQK0cgmuA1eN\n5IqqvSJacbU9KA7rJlNtXkgVfPyKa0xr5pwtulNW3kNHE1yfeJ08l3G7fAiPLWa3\nRYAz2hrJ3f1oQuZnT9RFU6wNwd1iz+dXiaWPTulq3SIqpgZWRGSPSKR7Fwbcj7oJ\net90m/5KKV9ir56ia7gdEFFjpTUwou8WT+YHFIVRSCA/FOR+5Dff6NIcYRczIMbB\nVNssnQh0e2YDWCyiNN+WuPPd9Njg9WOQh90R8gfh0HfnCoMEaj5dC9EUo9KSipyE\nfi1lJkO9uVXBs0HzLMc4+ObagZBMNNaO9wEEyRjt7QKBgQDwASQkmPn7byxTIelx\nEET8d/5rwvYI3qNfmxn/5HIx7aBIqCG/ksA5ZYDpQ+YOjms5cUQl0x7ZxBg0824p\nt/rcViVfIaXYUh2kf2wqIak/ZhGeYXpyL7ruktEIEXntbGEixPdDO1trH/vJ9HYJ\n+1LZdEtCSO5dVNpkKLQRTI/x1QKBgQDGnTuIJY+THzjrajlmwnhW8N17zKOOHA6d\nqBHEZQBwz/ssupxAMeEAVw33gOP3uakebfpectmKiXtXAcoBwfweJ1fR0/QDxaBV\nsRbu5hOkmuqgomFJ9vukej8iqd1auHnbRb2m2jpCuKc2ukDQ4x1NWDu7PXxmtBqE\n7VqTMfHGEwKBgEv0wICInYzSiV+h+uRadsrEGxP1trHl7CSEzLysiut8Pd7gvxWH\nFyjTE/I/F98BebPLQfsKjtfydIrFg9bWMCFtbhRmbLtCebkmzo+i6ZJz9h1+0iaz\nLmD0vAzmowTd6Pv9BBgV//+uNpyaroTIMlc5s9u9gxqskRVjwGE9Ls0lAoGAR+/B\nFTHNi9L+Mb4apk5/ebXp8qIPBzTAUngCX2jZvQKHjg7U8yddwFrHk0KazynuyDe7\nPCRLCLN8+emK+hIBuAY196jWM9uLlB39GXA54x+9JYtKw5hyUoN4hJyTsP0qHbJn\n25wlB++LmPXi7gWkolP35nyBp01KYaT6bl/jmwMCgYEAvIjL4PwsIJU6sIOtuiGQ\nlZVDAY7K/RMxVEvo8QchBHMLVY2rbg1nGdLLbZn6WDemoxnA2JCDTqFxhl2Ue3UI\nx25icZh8TzCV4TNrJUvpOh2Ltp92rltc0zfNy1VKcBsWAscJXwADH0OjpIxfxXNp\nHXEstkbo1eo+pVTRq61iW5o=\n-----END PRIVATE KEY-----\n",
    client_email: "textdetection@test-image-api-358416.iam.gserviceaccount.com",
    client_id: "115006785167494947450",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/textdetection%40test-image-api-358416.iam.gserviceaccount.com",
  })
);

const CONFIG = {
  credentials: {
    private_key: CREDANTIOLS.private_key,
    client_email: CREDANTIOLS.client_email,
  },
};

const client = new vision.ImageAnnotatorClient(CONFIG);

const app = express();
app.use(cors());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);

app.use(
  bodyParser.json({ limit: "50mb", type: "application/json", extended: true })
);

app.use(
  bodyParser.text({ limit: "50mb", type: "application/json", extended: true })
);

app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
  })
);

app.use("/src", express.static(__dirname + "/src"));
// app.use("/src", express.static(__dirname + "/src/db/"));
app.use("/src", express.static(__dirname + "/src/db/German-Cards.realm"));
app.use("/src", express.static(__dirname + "/src/db/Ukrainian_Cards.realm"));

app.use("/", router);

app.get("/all-in-db", async (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  const allDB = await getAllfromDBs(queryObject);
  const cards = JSON.parse(JSON.stringify(allDB));
  res.send(JSON.stringify(cards));
});

app.post("/delete-row", async (req, res) => {
  const item = JSON.parse(req.body.body);
  try {
    const currenItemUk = await uk_db
      .objects("Card")
      .filter((userObj) => userObj.id == item.id);
    if (currenItemUk.length > 0) {
      await uk_db.write(async () => {
        return await uk_db.delete(currenItemUk);
      });
      return res.send({ status: "saccess" });
    }
    const currenItemDe = await de_db
      .objects("Card")
      .filter((userObj) => userObj.id == item.id);
    if (currenItemDe.length > 0) {
      await de_db.write(async () => {
        return await de_db.delete(currenItemDe);
      });
      return res.send({ status: "saccess" });
    }
  } catch (error) {
    console.log(error);
    return res.send(JSON.stringify(error));
  }
});

app.get("/get-item", async (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  const id = queryObject.id;

  const currenItemUk = await uk_db
    .objects("Card")
    .filter((userObj) => userObj.id == id);

  if (currenItemUk.length > 0) {
    return res.send(JSON.stringify(currenItemUk[0]));
  }

  const currenItemDe = await de_db
    .objects("Card")
    .filter((userObj) => userObj.id == id);
  if (currenItemDe.length > 0) {
    return res.send(JSON.stringify(currenItemDe[0]));
  }
});

app.post("/updateRow", async (req, res) => {
  const item = JSON.parse(req.body.body);
  let len = "";
  let currentItem;
  try {
    const currenItemUk = await uk_db
      .objects("Card")
      .filter((userObj) => userObj.id == item.id);

    if (currenItemUk.length > 0) {
      len = "uk";
      currentItem = currenItemUk[0];
    } else {
      const currenItemDe = await de_db
        .objects("Card")
        .filter((userObj) => userObj.id == item.id);

      if (currenItemDe.length > 0) {
        len = "de";
        currentItem = currenItemDe[0];
      }
    }

    if (len === "de") {
      await de_db.write(async () => {
        currentItem.cardNumber = item.cardNumber;
        currentItem.name = item.name;
        currentItem.plural = item.plural;
        currentItem.secondary = item.secondary;
        currentItem.example = item.example;
        currentItem.category = item.category;
      });
    } else if (len === "uk") {
      await uk_db.write(async () => {
        currentItem.cardNumber = item.cardNumber;
        currentItem.name = item.name;
        currentItem.plural = item.plural;
        currentItem.secondary = item.secondary;
        currentItem.example = item.example;
        currentItem.category = item.category;
      });
    }
  } catch (error) {
    return res.send(JSON.stringify({ status: "error" }));
  }

  return res.send(JSON.stringify({ status: "success" }));
});

//  ---------- GOOGLE API ----------
app.post("/get-image-data", async (req, res) => {
  const filePath = req.files.file.tempFilePath;
  try {
    const all = await client.textDetection(filePath);
    const foolText = all[0].fullTextAnnotation.text.split("\n");
    const leng =
      all[0].fullTextAnnotation.pages[0].property.detectedLanguages[0]
        .languageCode;
    if (leng === "de") {
      try {
        await saveDeRow(foolText);
      } catch (error) {
        console.log("DE DB ERROR \n", error);
        res.send({
          status: "error",
          messige: "save DE DB Error",
        });
        return;
      }
    } else if (leng === "uk" || leng === "ru") {
      try {
        await saveUkRow(foolText);
      } catch (error) {
        console.log("UK DB ERROR \n", error);
        res.send({
          status: "error",
          messige: "save UK DB Error",
        });
        return;
      }
    }
    res.send({
      status: "success",
      // data: JSON.stringify(allDB),
    });
    return;
  } catch (error) {
    console.log("ERROR =>>>>>>>>>>>>");
    res.status(400)
    res.send({
      status: "error",
      messige: "main Error > GOOGLE API",
    });
    return;
  }
});

const getAllfromDBs = async (queryObject = { sort: "cardNumber", leng:"all" }) => {
  const query = queryObject.sort;
  const leng = queryObject.leng || "all";
  // queryObject && queryObject.sort === "cardNumber" ? "cardNumber" : "id";  
  const ukData = await uk_db.objects("Card").sorted(query);
  const deData = await de_db.objects("Card").sorted(query);
  let allDB = [];
  if (leng === "all") {
    allDB = [...ukData, ...deData];
  } else if (leng === "uk") {
    allDB = [...ukData];
  } else if (leng === "de") {
    allDB = [...deData];
  }
  // const ukData = await uk_db.objects("Card").sorted(query);
  // const deData = await de_db.objects("Card").sorted(query);
  return allDB;
};

const saveDeRow = async (foolText) =>
  await de_db.write(async () => {
    de_db.create("Card", {
      id: uuid.v4(),
      cardNumber: foolText[0] || 0,
      name: foolText[1],
      plural: foolText[2],
      secondary: foolText[foolText.length - 3] || null,
      example: foolText[foolText.length - 2] || null,
      category: foolText[foolText.length - 1],
      systemImageName: "",
    });
  });

const saveUkRow = async (foolText) =>
  await uk_db.write(async () => {
    uk_db.create("Card", {
      id: uuid.v4(),
      cardNumber: foolText[0] || 0,
      name: foolText[1],
      plural: foolText[2],
      secondary: foolText[foolText.length - 3] || null,
      example: foolText[foolText.length - 2] || null,
      category: foolText[foolText.length - 1],
      systemImageName: "",
    });
  });

app.listen("3000", () => {
  // "192.168.1.108",
  console.log(`Example app listening \n`);
  // console.log("http:/192.168.1.108:3000");
});
