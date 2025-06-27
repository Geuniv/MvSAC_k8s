import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import MoveInPopup from "./MoveInPopup";
import MoveInReg from "./MoveInReg";
import "../css/MoveInListPage.css";

function MoveInListPage() {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedMoveIn, setSelectedMoveIn] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState({
    name: "",
    startDate: "",
    endDate: "",
    approval: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const loggedInUserId = parseInt(window.sessionStorage.getItem("user_id"), 10);
  const loggedInUserName = window.sessionStorage.getItem("user_name");
  const accessToken = window.sessionStorage.getItem("access_token");

  const fetchData = () => {
    axios
      // .get("http://localhost:8000/movein/", {
      // .get("http://sesac-lb-879754776.ap-northeast-2.elb.amazonaws.com/movein/", {
      // .get("https://sesacgeun.click/movein/", {
      .get("https://api.sesacgeun.click/movein/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        if (loggedInUserId === 1) {
          setAllData(res.data);
        } else {
          const userData = res.data.filter((item) => item.userId === loggedInUserId);
          setAllData(userData);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("데이터 로딩 중 오류 발생");
      });
  };

  useEffect(() => {
    fetchData();
  }, [loggedInUserId]);

  useEffect(() => {
    const result = allData
      .filter((item) => {
        const regDate = item.regDt?.substring(0, 10);
        return (
          (!search.name || item.name?.includes(search.name)) &&
          (!search.startDate || regDate >= search.startDate) &&
          (!search.endDate || regDate <= search.endDate) &&
          (!search.approval ||
            (search.approval === "승인" && item.isApproval === true) ||
            (search.approval === "대기" && item.isApproval === null))
        );
      })
      .sort((a, b) => new Date(b.regDt) - new Date(a.regDt)); // 최신순 정렬

    setFilteredData(result);
    setCurrentPage(1);
  }, [search, allData]);

  const approvedCount = allData.filter((item) => item.isApproval === true).length;
  const pendingCount = allData.filter((item) => item.isApproval === null).length;

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="movein-container">
      <div className="sidebar-box">
        <p>✅ 승인: {approvedCount}</p>
        <p>⏳ 대기: {pendingCount}</p>
      </div>

      <div className="main-content">
        <div className="top-header">
          <h1>
            <span className="username-highlight">
              {loggedInUserName || "알 수 없음"}
            </span>{" "}
            담당 전입신청 목록
          </h1>
          <button className="btn-primary" onClick={() => setShowModal(true)}>등록</button>
        </div>

        <div className="search-section">
          <SearchBar search={search} setSearch={setSearch} />
        </div>

        {error && <p className="error-text">{error}</p>}

        <table className="movein-table">
          <thead>
            <tr>
              <th>신청자</th>
              <th>이전 주소</th>
              <th>신규 주소</th>
              <th>신청일</th>
              <th>승인 상태</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <tr key={item.id} onClick={() => setSelectedMoveIn(item)} style={{ cursor: "pointer" }}>
                  <td>{item.name}</td>
                  <td>{item.beforeAddr}</td>
                  <td>{item.afterAddr}</td>
                  <td>{item.regDt?.substring(0, 10)}</td>
                  <td>
                    {item.isApproval ? (
                      <span className="badge badge-approved">승인</span>
                    ) : (
                      <span className="badge badge-pending">대기</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">전입신청 데이터가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {selectedMoveIn && (
        <MoveInPopup
          data={selectedMoveIn}
          onClose={() => setSelectedMoveIn(null)}
          onUpdate={(updated) => {
            setSelectedMoveIn(updated);
            setAllData((prev) =>
              prev.map((item) => (item.id === updated.id ? updated : item))
            );
          }}
        />
      )}

      {showModal && (
        <MoveInReg
          onClose={() => setShowModal(false)}
          onRegister={fetchData}
        />
      )}
    </div>
  );
}

export default MoveInListPage;