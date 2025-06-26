import "./App.css";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const List = () => {
  // const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // 의존배열을 주지 않아서 처음에 마운트 할 때 한 번 실행되고 위에 선언한 useState배열이 초기화 될 때마다 떠서 현재 4번 실행됨
  // useEffect(() => {
  //   const token = window.sessionStorage.getItem("access_token");
  //   if (!token) {
  //     alert("로그인 후 사용하세요.");
  //     navigate("/login");
  //   }
  // });
  useEffect(() => {
  const token = window.sessionStorage.getItem("access_token");
  if (!token) {
    alert("로그인 후 사용하세요.");
    navigate("/login");
  }
}, []);  // ✅ 마운트 시 1회만 실행

  useEffect(() => {
    // axios.get('http://localhost:8000/events/')
    // axios.get('http://sesac-lb-879754776.ap-northeast-2.elb.amazonaws.com/events/')
    axios.get('https://sesacgeun.click/events/')
      .then((response) => {
        setEvents(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('이벤트 데이터를 불러오는 데 실패했습니다.');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>이벤트 목록</h2>
      {events.length === 0 ? (
        <p>이벤트가 없습니다.</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event.id} style={{ marginBottom: '20px' }}>
              <h3><Link to={`/detail/${event.id}`}>{event.title}</Link></h3>
              {/* {event.image && <img src={`http://localhost:8000/events/download/${event.id}`} alt={event.title} style={{ width: '200px' }} />} */}
              {/* {event.image && <img src={`http://sesac-lb-879754776.ap-northeast-2.elb.amazonaws.com/events/download/${event.id}`} alt={event.title} style={{ width: '200px' }} />} */}
              {event.image && <img src={`https://sesacgeun.click/events/download/${event.id}`} alt={event.title} style={{ width: '200px' }} />}
              <p><strong>설명:</strong> {event.description}</p>
              <p><strong>위치:</strong> {event.location}</p>
              <p><strong>태그:</strong> {event.tags}</p>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate("/regist")}>이벤트 등록</button>
    </div>
  );
};

export default List;
