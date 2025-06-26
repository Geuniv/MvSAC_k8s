import "../css/UserList.css";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Signup from "../user/signup";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    const role = sessionStorage.getItem("role");

    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    if (role !== "Y") {
      alert("접근 권한이 없습니다.");
      navigate("/list");
      return;
    }

    // axios.get('http://localhost:8000/users/', {
    // axios.get('http://sesac-lb-879754776.ap-northeast-2.elb.amazonaws.com/users/', {
    axios.get('https://sesacgeun.click/users/', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    .then((response) => {
      setUsers(response.data);
    })
    .catch((err) => {
      console.error(err);
      alert("사용자 목록을 불러오는 데 실패했습니다.");
      navigate("/login");
    });
  }, [navigate]);

  const handleDelete = (userId) => {
    if (window.confirm("정말로 이 사원을 삭제하시겠습니까?")) {
      // axios.delete(`http://localhost:8000/users/${userId}`, {
      // axios.delete(`http://sesac-lb-879754776.ap-northeast-2.elb.amazonaws.com/users/${userId}`, {
      axios.delete(`https://sesacgeun.click/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${window.sessionStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        setUsers(users.filter(user => user.id !== userId));
        alert(response.data.message);
      })
      .catch((err) => {
        console.error(err);
        alert("사원 삭제에 실패했습니다.");
      });
    }
  };

  return (
    <div className="userlist-container">
      <div className="userlist-header">
        <h2>사원 목록</h2>
        <button className="register-btn" onClick={() => setShowSignupModal(true)}>+ 등록</button>
      </div>

      {users.length === 0 ? (
        <p>등록된 사원이 없습니다.</p>
      ) : (
        <ul className="user-list">
          {users.map((user) => (
            <li key={user.id} className="user-item">
              <div><strong>이름:</strong> {user.username}</div>
              <div><strong>이메일:</strong> {user.email}</div>
              {user.role === 'N' && (
                <button className="delete-btn" onClick={() => handleDelete(user.id)}>삭제</button>
              )}
            </li>
          ))}
        </ul>
      )}

      {showSignupModal && (
        <div className="popup" onClick={() => setShowSignupModal(false)}>
          <div className="popup-content" onClick={e => e.stopPropagation()}>
            <Signup onClose={() => setShowSignupModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;