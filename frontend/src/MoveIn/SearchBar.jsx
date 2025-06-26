import React from "react";
import "../css/SearchBar.css";
import "../css/MoveInListPage.css"; // CSS 클래스 적용

function SearchBar({ search, setSearch }) {
  const reset = () =>
    setSearch({ name: "", startDate: "", endDate: "", approval: "" });

  return (
    <div className="searchbar-container">
      <input
        type="text"
        placeholder="이름 검색"
        value={search.name}
        onChange={(e) => setSearch({ ...search, name: e.target.value })}
        className="search-input"
      />
      <input
        type="date"
        value={search.startDate}
        onChange={(e) => setSearch({ ...search, startDate: e.target.value })}
        className="date-input"
      />
      <span className="date-separator">~</span>
      <input
        type="date"
        value={search.endDate}
        onChange={(e) => setSearch({ ...search, endDate: e.target.value })}
        className="date-input"
      />
      <select
        value={search.approval}
        onChange={(e) => setSearch({ ...search, approval: e.target.value })}
        className="select-box"
      >
        <option value="">승인여부 전체</option>
        <option value="승인">승인</option>
        <option value="대기">대기</option>
        <option value="거절">거절</option>
      </select>
      <button onClick={reset} className="reset-btn">초기화</button>
    </div>
  );
}

export default SearchBar;