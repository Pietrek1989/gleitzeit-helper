import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./components/MainPage.tsx";
import "./index.css";
import ShareWeek from "./components/ShareWeek.tsx";

function App() {
  return (
    <>
          <BrowserRouter>

      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/shared/:id" element={<ShareWeek />} />
      </Routes>
</BrowserRouter>
    </>
  );
}

export default App;
