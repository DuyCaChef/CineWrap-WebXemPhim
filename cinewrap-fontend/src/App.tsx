import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage"; // Trang chào mừng với video nền
// import HomePage from './pages/HomePage'; (Trang chủ của bạn)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Đặt Landing Page ở đường dẫn gốc */}
        <Route path="/" element={<WelcomePage />} />

        {/* Nút "Bắt đầu" sẽ trỏ về đây */}
        {/* <Route path="/home" element={<HomePage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
