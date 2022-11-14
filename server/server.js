const express = require("express");
const cors = require("cors");

const session = require("express-session");

//DB 연결 수행 전 라이브러리 호출==========
const mysql = require("mysql2");
const db = mysql.createPoolCluster();
//DB 연결 수행 전 라이브러리 호출==========

const app = express();
const port = 4000;

app.use(express.json());
app.use(
  session({
    secret: "SECRET",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

db.add("article_project", {
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "article_project",
  port: 3306,
});

function 디비실행(query) {
  return new Promise(function (resolve, reject) {
    db.getConnection("article_project", function (error, connection) {
      if (error) {
        console.log("디비 연결 오류", error);
        reject(true);
      }

      connection.query(query, function (error, data) {
        if (error) {
          console.log("쿼리 오류", error);
          reject(true);
        }

        resolve(data);
      });
      connection.release();
    });
  });
}

app.get("/", async (req, res) => {
  const 데이터 = await 디비실행("SELECT * FROM user");

  console.log(데이터);

  res.send("HELLO!!!");
});

app.post("/join", async (req, res) => {
  const { id, pw } = req.body;

  const result = {
    code: "success",
    message: "회원가입되었습니다.",
  };

  const 회원 = await 디비실행(`SELECT * FROM user WHERE id = '${id}'`);

  if (회원.length > 0) {
    result.code = "error";
    result.message = "이미 가입되어 있는 아이디입니다.";
    res.send(result);
    return;
  }

  const query = `INSERT INTO user(id, password, nickname) VALUES('${id}', '${pw}','지나가던나그네')`;

  await 디비실행(query);

  res.send(result);
});

app.get("/user", (req, res) => {
  res.send(req.session.loginUser); //req.session 전역으로 모든 요청에 다 쓸 수 있음
});

app.get("/test", (req, res) => {
  console.log(req.session);

  res.send("//");
});

app.post("/login", async (req, res) => {
  const { id, pw } = req.body;

  const result = {
    code: "success",
    message: "로그인 되었습니다.",
  };

  const 회원 = await 디비실행(
    `SELECT * FROM user WHERE id='${id}' AND password='${pw}'`
  );

  if (회원.length === 0) {
    result.code = "error";
    result.message = "회원 정보가 존재하지 않습니다.";
    res.send(result);
    return;
  }

  req.session.loginUser = 회원[0];
  req.session.save();

  res.send(result);
});

app.listen(port, () => {
  console.log("서버가 시작되었습니다.");
});
