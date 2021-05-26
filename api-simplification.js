const express = require("express");
const mysql = require("mysql");
const app = express();
const cors = require("cors");
const path = require("path");
const urlencode = require("urlencode");
const dateOfOffset = require(path.resolve(__dirname, "./dateOfOffset"));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let db_config = require("./connection.js");

function handleDisconnect() {
  connection = mysql.createConnection(db_config);

  connection.connect(function (err) {
    if (err) {
      setTimeout(handleDisconnect, 2000);
    } else {
      console.log("connected to database");
    }
  });

  connection.on("error", function (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}
handleDisconnect();

let searchColumns = ["soc", "reg"];

function validateReq(req, res, next) {
  if (
    searchColumns.filter((column) => !Object.keys(req.query).includes(column))
      .length
  ) {
    res.status(400).end("BAD REQUEST");
    return;
  }
  next();
}

app.get("/", validateReq, (req, res) => {
  let sql = mysql.format(
    `SELECT * FROM offset_simpl WHERE reg = ? AND soc1 = ?`,
    [req.query.reg, req.query.soc]
  );
  console.log(sql);
  executeQuery(sql)
    .then((results) => {
      results = results
        .filter((result) => {
          return urlencode.decode(result.date) == dateOfOffset;
        })
        .map((result) => {
          return urlencode.decode(result.options);
        });

      res.end(JSON.stringify(results));
    })
    .catch((err) => {
      console.log(err);
      res.status(500).end(JSON.stringify(err));
    });
});
app.all("*", (req, res) => {
  res.status(404).end("NOT FOUND");
});

function executeQuery(query) {
  return new Promise((resolve, reject) => {
    connection.query(query, function (error, result, field) {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
}

const PORT = 3033;
app.listen(PORT, console.log(`СЕРВЕР РАБОТАЕТ НА ПОРТУ : ${PORT}`));
