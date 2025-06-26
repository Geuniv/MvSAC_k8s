import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './Header';  // 햄이 만든 Header 경로 기준으로

export default function Layout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");

    // 로그인 여부에 따라 기본 라우팅
    if (token) {
      navigate("/list");
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}