import { useEffect, useState } from "react";
import axios from "axios";
import "../css/Profile.css";

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [username, setUsername] = useState("");
    const [image, setImage] = useState(null);
    const [editing, setEditing] = useState(false);

    const token = sessionStorage.getItem("access_token");

    useEffect(() => {
        // axios.get("http://localhost:8000/users/profile", {
        // axios.get("http://sesac-lb-879754776.ap-northeast-2.elb.amazonaws.com/profile", {
        axios.get("https://sesacgeun.click/profile", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            setProfile(res.data);
            setUsername(res.data.username);
        })
        .catch(err => {
            console.error(err);
            alert("프로필 정보를 가져오지 못했습니다.");
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("data", JSON.stringify({ username }));
        if (image) formData.append("image", image);

        try {
            // await axios.put("http://localhost:8000/users/profile", formData, {
            // await axios.put("http://sesac-lb-879754776.ap-northeast-2.elb.amazonaws.com/users/profile", formData, {
            await axios.put("https://sesacgeun.click/users/profile", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            alert("프로필 수정 완료");
            setEditing(false);
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert("프로필 수정 실패");
        }
    };

    if (!profile) return <p className="loading">로딩 중...</p>;

    return (
        <div className="profile-container">
            <h2>사원 정보</h2>
            {editing ? (
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="이름 수정"
                    />
                    <input
                        type="file"
                        onChange={e => setImage(e.target.files[0])}
                    />
                    <button type="submit">저장</button>
                    <button type="button" onClick={() => setEditing(false)}>취소</button>
                </form>
            ) : (
                <>
                    <img
                        src={profile.profile_image_url || "https://i.pinimg.com/736x/3c/f0/84/3cf084a78beb6119dd6633737950ab38.jpg"}
                        alt="프로필 이미지"
                        className="profile-img"
                    />
                    <p><strong>이메일:</strong> {profile.email}</p>
                    <p><strong>이름:</strong> {profile.username}</p>
                    <button onClick={() => setEditing(true)}>프로필 수정</button>
                </>
            )}
        </div>
    );
}