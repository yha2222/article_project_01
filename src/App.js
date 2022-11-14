import axios from "axios";
import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";

axios.defaults.withCredentials = true;

function Join() {
  const navigation = useNavigate();

  const [data, setData] = React.useState({
    id: "",
    pw: "",
  });

  const 데이터변경 = (event) => {
    const name = event.target.name;
    const cloneData = { ...data };
    cloneData[name] = event.target.value;
    setData(cloneData);
  };

  const 회원가입 = async () => {
    await axios({
      url: "http://localhost:4000/join",
      method: "POST",
      data: data,
    })
      .then((res) => {
        const { code, message } = res.data;

        if (code === "success") {
          alert(message);
          navigation("/login");
        }
      })
      .catch((e) => {
        console.log("join Error", e);
      });

    console.log(data);
  };

  return (
    <div>
      <input type="text" name="id" onChange={데이터변경} />
      <input type="password" name="pw" onChange={데이터변경} />
      <button type="button" onClick={회원가입}>
        회원가입
      </button>
    </div>
  );
}

function Login() {
  const [data, setData] = React.useState({
    id: "",
    pw: "",
  });

  const 데이터변경 = (event) => {
    const name = event.target.name;
    const cloneData = { ...data };
    cloneData[name] = event.target.value;
    setData(cloneData);
  };

  const 로그인 = async () => {
    await axios({
      url: "http://localhost:4000/login",
      method: "POST",
      data: data,
    })
      .then((res) => {
        alert(res.data.message);

        if (res.data.code === "success") {
          window.location.href = "/";
        }
      })
      .catch((e) => {
        console.log("Login Error", e);
      });
  };

  return (
    <div>
      <input type="text" name="id" onChange={데이터변경} />
      <input type="password" name="pw" onChange={데이터변경} />
      <button type="button" onClick={로그인}>
        로그인
      </button>
    </div>
  );
}

function Main() {
  return <div>Main</div>;
}

const StoreContext = React.createContext({});

function App() {
  //새로고침 될 때마다 State 초기화 되니까 loginUser 값 빈 값 되니까
  //새로고침 할 때마다 세션정보도 불러오게 하기, 보안도 굳
  const [loginUser, setLoginUSer] = React.useState({});

  const 세션정보가져오기 = async () => {
    await axios({
      url: "http://localhost:4000/user",
      //기본 GET 생략 가능
    }).then((res) => {
      console.log(res.data);

      setLoginUSer(res.data);
    });
  };

  React.useEffect(() => {
    세션정보가져오기();
  }, []);

  return (
    <StoreContext.Provider
      value={{
        loginUser,
      }}
    >
      <Routes>
        <Route exact path="/" element={<Main />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/join" element={<Join />} />
      </Routes>
    </StoreContext.Provider>
  );
}

export default App;
