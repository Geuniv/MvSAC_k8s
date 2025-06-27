import axios from "axios";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const inputRef = useRef();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const changeUsername = e => setUsername(e.target.value);
  const changePassword = e => setPassword(e.target.value);

  const handleSubmit = e => {
    e.preventDefault();

    // application/x-www-form-urlencoded 형식으로 데이터 전송
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    axios
      // .post("http://localhost:8000/users/signin/",
      // .post("http://sesac-lb-879754776.ap-northeast-2.elb.amazonaws.com/users/signin/", 
      // .post("https://sesacgeun.click/users/signin/", 
      .post("https://api.sesacgeun.click/users/signin/",
        // { username, password },
        params,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } })
      .then(res => {
        if (res.status === 200) {
          alert(res.data.message);
          window.sessionStorage.setItem("access_token", res.data.access_token);
          window.sessionStorage.setItem("user_email", res.data.email);
          window.sessionStorage.setItem("user_id", res.data.user_id);
          window.sessionStorage.setItem("user_name", res.data.username);
          window.sessionStorage.setItem("role", res.data.role);
          // window.location.href = "/list";
          navigate("/list");
        }
      })
      .catch(err => {
        console.log(err);
        if (err.status === 401 || err.status === 404) {
          alert("로그인에 실패했습니다.\n" + err.response.data.detail);
        } else {
          alert("로그인에 실패했습니다.");
        }

        setUsername('');
        setPassword('');
        inputRef.current.focus();
      });
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          ref={inputRef}
          value={username}
          onChange={changeUsername}
          placeholder="이메일을 입력하세요."
        />
        <input
          type="password"
          value={password}
          onChange={changePassword}
          placeholder="패스워드를 입력하세요."
        />
        <button type="submit">로그인</button>
      </form>
    </div>
  );
}