import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage"; // Trang chào mừng với video nền
import HomePage from "./pages/HomePage"; //(Trang chủ của bạn)
import ProfilePage from "./pages/ProfilePage"; // Trang profile
import MoviesPage from "./pages/MoviesPage"; // Trang filter
import MovieDetailPage from "./pages/MovieDetailPage"; // Trang chi tiết phim
import WatchPage from "./pages/WatchPage"; // Trang xem phim
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminCrawlerPage from "./pages/admin/AdminCrawlerPage"; // Trang quản trị cào phim

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Đặt Landing Page ở đường dẫn gốc */}
        <Route path="/" element={<WelcomePage />} />

        {/* Nút "Bắt đầu" sẽ trỏ về đây */}
        <Route path="/home" element={<HomePage />} />

        {/* Trang Profile */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* Trang MoviesPage */}
        <Route path="/movies" element={<MoviesPage />} />

        {/* Trang Chi Tiết Phim */}
        <Route path="/movie/:slug" element={<MovieDetailPage />} />

        {/* Trang Xem Phim */}
        <Route path="/watch/:slug" element={<WatchPage />} />

        {/* Trang quản trị */}
        <Route path="/admin" element={<AdminDashboardPage />} />

        {/* Trang quản trị cào phim */}
        <Route path="/admin/crawler" element={<AdminCrawlerPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
