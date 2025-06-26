import React, { useState, useEffect } from "react";
import "../css/MoveInPopup.css";
import axios from "axios";

function MoveInPopup({ data, onClose, onUpdate }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [fullData, setFullData] = useState(data);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // const res = await axios.get(`http://localhost:8000/movein/${data.id}`, {
        // const res = await axios.get(`http://sesac-lb-879754776.ap-northeast-2.elb.amazonaws.com/movein/${data.id}`, {
        const res = await axios.get(`https://sesacgeun.click/movein/${data.id}`, {
          headers: {
            Authorization: `Bearer ${window.sessionStorage.getItem("access_token")}`,
          },
        });
        console.log("📦 상세 데이터 받아옴:", res.data);
        setFullData(res.data);
      } catch (err) {
        console.error("❌ 상세조회 실패:", err);
        alert("상세 정보를 가져오지 못했습니다.");
      }
    };

    if (data?.id) fetchDetails();
  }, [data?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const updatedData = { ...fullData, ...formData };
      // const res = await axios.put(`http://localhost:8000/movein/${data.id}`, updatedData);
      // 로드밸런서 엔드포인트로 변경
      // const res = await axios.put(`http://sesac-lb-879754776.ap-northeast-2.elb.amazonaws.com/movein/${data.id}`, updatedData);
      const res = await axios.put(`https://sesacgeun.click/movein/${data.id}`, updatedData);
      alert("전입신청 정보가 수정되었습니다.");
      setIsEditMode(false);
      if (onUpdate) onUpdate(res.data);
    } catch (error) {
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  const handleApproval = async () => {
    const confirmed = window.confirm("정말로 승인하시겠습니까?");
    if (!confirmed) return;

    try {
      const response = await axios.put(
        // `http://localhost:8000/movein/approval/${data.id}`,
        // 로드밸런서 엔드포인트로 변경
        // `http://sesac-lb-879754776.ap-northeast-2.elb.amazonaws.com/movein/approval/${data.id}`,
        `https://sesacgeun.click/movein/approval/${data.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${window.sessionStorage.getItem("access_token")}`,
          },
        }
      );
      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error("승인 중 오류:", error);
      alert("승인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="popup" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        {!isEditMode ? (
          <>
            <h3>전입신청 상세정보</h3>
            <div className="popup-info">
              <p><strong>이름:</strong> {fullData.name}</p>
              <p><strong>이메일:</strong> {fullData.email}</p>
              <p><strong>주민번호:</strong> {fullData.rrn}</p>
              <p><strong>이전 주소:</strong> {fullData.beforeAddr}</p>
              <p><strong>신규 주소:</strong> {fullData.afterAddr}</p>
              <p><strong>등록일:</strong> {fullData.regDt}</p>
              <p><strong>입주일:</strong> {fullData.moveInDt}</p>
              <p><strong>승인일:</strong> {fullData.approvalDt || "미승인"}</p>
              <p><strong>승인여부:</strong> {fullData.isApproval ? "승인" : "대기"}</p>
            </div>
            <div className="popup-buttons">
              {parseInt(window.sessionStorage.getItem("user_id"), 10) === 1 && (
                <button onClick={handleApproval}>승인</button>
              )}
              <button onClick={() => setIsEditMode(true)}>수정</button>
              <button onClick={onClose}>닫기</button>
            </div>
          </>
        ) : (
          <>
            <h3>전입신청 수정</h3>
            <form className="edit-form">
              {[
                { label: "이름", name: "name" },
                { label: "이메일", name: "email" },
                { label: "주민번호", name: "rrn" },
                { label: "이전 주소", name: "beforeAddr" },
                { label: "신규 주소", name: "afterAddr" },
                { label: "입주일", name: "moveInDt", type: "date" },
              ].map(({ label, name, type = "text" }) => (
                <div className="form-row" key={name}>
                  <label>{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={
                      type === "date"
                        ? formData[name] || (fullData[name] ? fullData[name].substring(0, 10) : "")
                        : formData[name] || ""
                    }
                    placeholder={type !== "date" ? fullData[name] || "" : undefined}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </form>
            <div className="popup-buttons">
              <button onClick={handleSave}>저장</button>
              <button onClick={() => setIsEditMode(false)}>취소</button>
              <button onClick={onClose}>닫기</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MoveInPopup;