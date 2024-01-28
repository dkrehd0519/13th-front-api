import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MainPage() {
  const [recaps, setRecaps] = useState([]);

  function getRecap() {
    fetch("https://ll-api.jungsub.com/recap/list")
      .then((response) => response.json())
      .then((data) => setRecaps(data));
  }

  // console.log(recaps);

  useEffect(() => {
    getRecap();
    //함수
  }, []);

  return (
    <div>
      <h1>Hello World</h1>
      <div>
        <Link to="/create">생성하기</Link>
      </div>
      <div>
        {recaps.map((element) => {
          return (
            <div>
              <Link to={"/recap/" + element._id} key={element._id}>
                {element.title}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MainPage;
