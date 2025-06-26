import "../App.css";
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = sessionStorage.getItem("access_token");
    const storedName = sessionStorage.getItem("user_name");
    const storedRole = sessionStorage.getItem("role");

    if (storedToken && storedName) {
      setUser(storedName);
      setUserRole(storedRole);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setUser(null);
    setUserRole(null);
    navigate("/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  // 로고 클릭 시 리다이렉트 처리
  const handleLogoClick = (e) => {
    e.preventDefault(); // 기본 링크 동작 막음
    if (user) {
      navigate("/list");
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="topnav">
      <div className="nav-left">
        {/* Link 대신 버튼 클릭 처리 */}
        <a href="/" className="logo" onClick={handleLogoClick}>
          <img
            src="https://sesac.seoul.kr/static/common/images/www/common/logo.png"
            alt="전입신고 서비스 로고"
            className="logo-img"
          />
        </a>

        {user && (
          <>
            <Link to="/list" style={{ marginLeft: "20px" }}>목록</Link>
            {userRole === "Y" && (
              <Link to="/users" style={{ marginLeft: "20px" }}>사용자</Link>
            )}
          </>
        )}
      </div>

      <div className="nav-right">
        {user ? (
          <div className="dropdown">
            <button className="dropbtn" onClick={toggleDropdown}>
              {user}
            </button>
            {dropdownOpen && (
              <div className="dropdown-content">
                <Link to="/profile">프로필</Link>
                <button onClick={handleLogout}>로그아웃</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">로그인</Link>
        )}
      </div>
    </header>
  );
}