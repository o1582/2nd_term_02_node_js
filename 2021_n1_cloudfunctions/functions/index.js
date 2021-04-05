/*
npm install -g firebase-tools
mkdir 2021_n1_cloudfunctions
firebase init
  Error: Failed to authenticate, have you run firebase login?
firebase login
firebase serve

curl http://localhost:5000/<firebase project name>/..../api/..../....

firebase deploy

cd 2021_n1_cloudfunctions/functions/
npm install express
npm install request
npm install request-promise-native
npm install cors
*/

// index.js
const functions = require("firebase-functions");
const express = require("express");
const requestPromise = require("request-promise-native"); // 追加
const cors = require("cors");

const app = express();

// 全部外部からのリクエストを許可する場合
// app.use(cors());

// APIにリクエストを送る関数を定義
const getDataFromApi = async (keyword) => {
  // cloud functionsから実行する場合には地域の設定が必要になるため，`country=JP`を追加している
  const requestUrl =
    "https://www.googleapis.com/books/v1/volumes?country=JP&q=intitle:";
  const result = await requestPromise(`${requestUrl}${keyword}`);
  return result;
};

app.get("/hello", (req, res) => {
  res.send("Hello Express!");
});

app.get("/user/:userId", (req, res) => {
  const users = [
    { id: 1, name: "ジョナサン" },
    { id: 2, name: "ジョセフ" },
    { id: 3, name: "承太郎" },
    { id: 4, name: "仗助" },
    { id: 5, name: "ジョルノ" },
  ];
  // req.params.userIdでURLの後ろにつけた値をとれる．
  const targetUser = users.find(
    (user) => user.id === Number(req.params.userId)
  );
  res.send(targetUser);
});

// エンドポイント追加
// 個別の API について CORS を許可したい場合
app.get("/gbooks/:keyword", cors(), async (req, res) => {
  // APIリクエストの関数を実行
  const response = await getDataFromApi(req.params.keyword);
  res.send(response);
});

const api = functions.https.onRequest(app);
module.exports = { api };
