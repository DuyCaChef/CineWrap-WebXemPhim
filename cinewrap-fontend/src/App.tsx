import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage"; // Trang chào mừng với video nền
import HomePage from "./pages/HomePage"; //(Trang chủ của bạn)
import ProfilePage from "./pages/ProfilePage"; // Trang profile
import FilterPage from "./pages/FilterPage"; // Trang filter

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Đặt Landing Page ở đường dẫn gốc */}
        <Route path="/" element={<WelcomePage />} />

        {/* Nút "Bắt đầu" sẽ trỏ về đây */}
        <Route path="/home" element={<HomePage />} />

        {/* Trang Filter */}
        <Route path="/movies" element={<FilterPage />} />

        {/* Trang Profile */}
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
