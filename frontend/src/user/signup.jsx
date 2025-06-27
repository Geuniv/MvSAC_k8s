import axios from "axios";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Signup.css";

export default function Signup() {
    const navigate = useNavigate();
    const inputRef = useRef();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [file, setFile] = useState(null);
    const [role, setRole] = useState('N');

    const changeUsername = e => setUsername(e.target.value);
    const changeEmail = e => setEmail(e.target.value);
    const changePassword = e => setPassword(e.target.value);
    const changeConfirmPassword = e => setConfirmPassword(e.target.value);
    const changeRole = e => setRole(e.target.value);
    const changeFile = e => setFile(e.target.files[0]);

    const handleSubmit = e => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        const formData = new FormData();
        formData.append("data", JSON.stringify({
            username,
            email,
            password,
            role
        }));

        if (file) formData.append("image", file);

        axios
            // .post("http://localhost:8000/users/signup", formData, {
            // .post("http://sesac-lb-879754776.ap-northeast-2.elb.amazonaws.com/users/signup", formData, {
            // .post("https://sesacgeun.click/users/signup", formData, {
            .post("https://api.sesacgeun.click/users/signup", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${sessionStorage.getItem("access_token")}`
                }
            })
            .then(res => {
                if (res.status === 201) {
                    alert(res.data.message);
                    // navigate("/list");
                    // navigate("/users")
                    window.location.href = "/users";
                }
            })
            .catch(err => {
                console.error(err);
                alert("회원가입에 실패했습니다.");
                inputRef.current.focus();
            });
    };

    return (
        <div className="signup-container">
            <h2>사원 등록</h2>
           <form onSubmit={handleSubmit} encType="multipart/form-data" className="signup-form">
            <input type="text" ref={inputRef} value={username} onChange={changeUsername} placeholder="이름" required />
            <input type="email" value={email} onChange={changeEmail} placeholder="이메일" required />
            <input type="password" value={password} onChange={changePassword} placeholder="비밀번호" required />
            <input type="password" value={confirmPassword} onChange={changeConfirmPassword} placeholder="비밀번호 확인" required />
            <input type="file" onChange={changeFile} />
            <button type="submit" className="submit-btn">등록</button>
           </form>
        </div>
    );
}