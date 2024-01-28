import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreatePage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerPass, setOwnerPass] = useState("");
  const [file, setFile] = useState();

  return (
    <div>
      <h1>새로만들기</h1>
      <div>
        <div className="title">
          Title{" "}
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
          <div className="body">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
            ></textarea>
          </div>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <div className="owner">
            <input
              placeholder="이름"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={ownerPass}
              onChange={(e) => setOwnerPass(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={(e) => {
            console.log(title, body, ownerName, ownerPass);
            const formData = new FormData();

            formData.append("title", title);
            formData.append("text", body);
            formData.append("owner_name", ownerName);
            formData.append("owner_pass", ownerPass);
            formData.append("file", file);

            fetch("http://localhost:3312/gallery/upload", {
              method: "post",
              // headers: {
              //   "Content-Type": "",
              // },
              body: formData,
            })
              .then((data) => data.json())
              .then((json) => {
                if (!!json.ok) {
                  // navigate("/recap/" + json.ok._id);
                }
              });
          }}
        >
          만들기
        </button>
      </div>
    </div>
  );
}

export default CreatePage;
