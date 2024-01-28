import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import MainPage from "./pages/MainPage";
import ItemPage from "./pages/ItemPage";
import CreatePage from "./pages/CreatePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/recap/:id" element={<ItemPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
