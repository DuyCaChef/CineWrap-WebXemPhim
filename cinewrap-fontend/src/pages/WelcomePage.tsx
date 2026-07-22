import React, { useEffect, useState } from "react";

// Import các component đã được bóc tách
import { HeaderLanding } from "../components/landing/HeaderLanding";
import { HeroSection } from "../components/landing/HeroSection";
import { GeneralSection } from "../components/landing/GeneralSection";
import { PrivacySection } from "../components/landing/PrivacySection";
import { TermsSection } from "../components/landing/TermsSection";
import { SupportSection } from "../components/landing/SupportSection";
import { Footer } from "../components/Footer";

const WelcomePage: React.FC = () => {
  // State lưu trữ id của Section đang hiển thị trên màn hình
  const [active, setActive] = useState<string>("welcome");

  // Logic Scrollspy: Xác định người dùng đang cuộn tới phần nào
  useEffect(() => {
    const ids = ["welcome", "general", "privacy", "terms", "support"];
    let rafId: number | null = null;

    const updateActive = () => {
      const headerEl = document.querySelector("header");
      const headerHeight = headerEl
        ? (headerEl as HTMLElement).offsetHeight
        : 0;

      // Điểm kiểm tra nằm ngay dưới thanh header một chút
      const point = headerHeight + 20;

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();

        // Nếu điểm kiểm tra nằm trong vùng của thẻ này
        if (rect.top <= point && rect.bottom >= point) {
          setActive(id);
          return;
        }
      }

      // Phương án dự phòng: Nếu cuộn quá nhanh, lấy phần tử có đỉnh gần điểm kiểm tra nhất
      let closest: { id: string; distance: number } | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const distance = Math.abs(rect.top - point);
        if (!closest || distance < closest.distance) closest = { id, distance };
      }
      if (closest) setActive(closest.id);
    };

    const onScroll = () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateActive);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateActive(); // Chạy lần đầu khi load trang

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Logic Smooth Scroll khi click vào link có hash
  useEffect(() => {
    // Khi trang vừa load hoặc URL thay đổi có chứa #hash
    if (location.hash) {
      // Dùng setTimeout nhỏ để đảm bảo các component con đã render xong hoàn toàn
      setTimeout(() => {
        const element = document.getElementById(location.hash.replace("#", ""));
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location]);

  return (
    <div className="w-full text-cine-text font-sans bg-cine-bg-primary selection:bg-cine-primary selection:text-cine-bg">
      {/* Thanh điều hướng nhận prop activeSection để tô sáng menu */}
      <HeaderLanding activeSection={active} />

      {/* Vùng chứa các nội dung chính */}
      <main className="pt-20 relative w-full min-h-screen">
        <HeroSection />
        <GeneralSection />
        <PrivacySection id="privacy-section" />
        <TermsSection id="terms-section" />
        <SupportSection />
      </main>

      {/* Chân trang */}
      <Footer />
    </div>
  );
};

export default WelcomePage;
