import React, { useState } from "react";
import axios from "axios";
import "../css/Modal.css";

export default function MoveInRegModal({ onClose, onRegister }) {
  const [form, setForm] = useState({
    name: "",
    rrn: "",
    email: "",
    beforeAddr: '',
    afterAddr: '',
    moveInDt: ''
  });

  const [rrn1, setRrn1] = useState("");
  const [rrn2, setRrn2] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "rrn1") {
      if (value.length <= 6) {
        setRrn1(value);
        setForm((prev) => ({ ...prev, rrn: `${value}-${rrn2}` }));
      }
    } else if (name === "rrn2") {
      if (value.length <= 7) {
        setRrn2(value);
        setForm((prev) => ({ ...prev, rrn: `${rrn1}-${value}` }));
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // const res = await axios.post("http://localhost:8000/movein/", form, {
      // 로드밸런서 엔드포인트로 변경
      // const res = await axios.post("http://sesac-lb-879754776.ap-northeast-2.elb.amazonaws.com/movein/", form, {
      const res = await axios.post("https://sesacgeun.click/movein/", form, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.sessionStorage.getItem("access_token")}`
        }
      });
      alert(res.data.message);
      onRegister();
      onClose();
    } catch (err) {
      console.error(err);
      alert("전입 등록 실패");
    }
  };

  return (
    <div className="popup" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h3>전입 신청</h3>
        <form onSubmit={handleSubmit} className="popup-form">
          {[
            { label: "이름", name: "name" },
            { label: "이메일", name: "email" },
          ].map(({ label, name, type = "text" }) => (
            <input
              key={name}
              name={name}
              type={type}
              value={form[name]}
              placeholder={label}
              onChange={handleChange}
              required
            />
          ))}

          <div className="rrn-group">
            <input
              name="rrn1"
              type="number"
              value={rrn1}
              placeholder="주민번호 앞 6자리"
              onChange={handleChange}
              maxLength="6"
              required
              className="half-input"
            />
            <span>-</span>
            <input
              name="rrn2"
              type="number"
              value={rrn2}
              placeholder="뒤 7자리"
              onChange={handleChange}
              maxLength="7"
              required
              className="half-input"
            />
          </div>

          {[
            { label: "입주 전 주소", name: "beforeAddr" },
            { label: "입주 후 주소", name: "afterAddr" },
            { label: "입주일", name: "moveInDt", type: "date" }
          ].map(({ label, name, type = "text" }) => (
            <input
              key={name}
              name={name}
              type={type}
              value={form[name]}
              placeholder={label}
              onChange={handleChange}
              required
            />
          ))}

          <button type="submit" className="submit-btn">등록</button>
          <button type="button" onClick={onClose} className="cancel-btn">취소</button>
        </form>
      </div>
    </div>
  );
}