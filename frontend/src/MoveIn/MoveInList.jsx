import React from "react";

function MoveInList({ data, onSelect }) {
  return (
    <ul>
      {data.map((item) => (
        <li
          key={item.id}
          onClick={() => onSelect(item)}
          style={{ cursor: "pointer", marginBottom: "10px" }}
        >
          {/* {item.username} - {item.afterAddr} */}
          {item.name} - {item.afterAddr} - {item.regDt?.substring(0, 10)} - {item.isApproval === true ? "승인" : "대기"}
        </li>
      ))}
    </ul>
  );
}

export default MoveInList;