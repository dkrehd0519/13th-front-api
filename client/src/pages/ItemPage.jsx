import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ItemPage() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [recapData, setRecapData] = useState({});
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetch("https://ll-api.jungsub.com/recap/get?id=" + id)
      .then((data) => data.json())
      .then((json) => setRecapData(json));
  }, []);

  if (!recapData._id) return <div>Loading...</div>;

  return (
    <div>
      <h1>Recap Data</h1>
      <h2>{recapData.title}</h2>
      <p>{recapData.owner_name}님이 작성했어요.</p>
      <p>{recapData.body}</p>
      <div>
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={() => {
            fetch("https://ll-api.jungsub.com/recap/delete", {
              method: "post",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: recapData._id,
                password,
              }),
            })
              .then((data) => data.json())
              .then((json) => {
                if (!!json.ok) {
                  navigate("/");
                }
              });
          }}
        >
          삭제
        </button>
      </div>
    </div>
  );
}

export default ItemPage;
