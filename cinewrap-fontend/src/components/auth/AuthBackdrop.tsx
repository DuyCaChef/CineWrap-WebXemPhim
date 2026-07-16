import { motion } from "framer-motion";

// ✅ ĐÃ TĂNG CƯỜNG: Tăng lên 100 hạt bụi với độ bắt sáng và kích thước đa dạng hơn để tạo chiều sâu rõ rệt
const CINEMATIC_PARTICLES = Array.from({ length: 100 }, (_, i) => {
  const size = Math.random() * 3.5 + 1.5; // Kích thước hạt từ 1.5px đến 5px
  return {
    id: i,
    size,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    // Quỹ đạo bay ngẫu nhiên và rộng hơn
    animateX: [0, Math.random() * 80 - 40, Math.random() * 80 - 40, 0],
    animateY: [0, Math.random() * 80 - 40, Math.random() * 80 - 40, 0],
    // Tăng độ đục tối đa (opacity) lên tới 0.8 để nhìn rõ mồn một xuyên qua lớp kính mờ
    opacity: [0, Math.random() * 0.5 + 0.3, 0],
    duration: Math.random() * 12 + 12, // Tốc độ bay sinh động hơn một chút (12s - 24s)
    delay: Math.random() * 4,
  };
});

export default function AuthBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[#05070f]"
    >
      {/* 1. Lớp lưới Vignette bo tối - Thu hẹp vùng tâm trong suốt để ép luồng sáng gom vào giữa Card */}
      <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(5,7,15,0.98)_85%)]" />

      {/* 2. Layer 1: Ambient Cinema Light (Đã tăng mạnh độ đục opacity từ 60% lên 85% để vệt sáng rực rỡ hơn) */}
      <div className="absolute inset-[-20%] z-0 opacity-85 auth-cinema-glow" />

      {/* 3. Layer 2: Luồng khói xanh Teal (Tăng bán kính từ 35rem lên 40rem và độ đậm lên 0.35) */}
      <motion.div
        className="absolute top-[5%] left-[5%] h-[40rem] w-[40rem] rounded-full blur-[110px] mix-blend-screen opacity-65"
        style={{
          background:
            "radial-gradient(circle, rgba(0, 245, 255, 0.35) 0%, rgba(0, 180, 216, 0.1) 50%, transparent 70%)",
        }}
        animate={{
          x: [-50, 60, -30, -50],
          y: [-40, 60, 30, -40],
          scale: [1, 1.2, 0.85, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 4. Layer 3: Luồng khói màu Vàng Gold ấm áp (Tăng mạnh độ đậm phối màu để tương phản rõ với góc Teal) */}
      <motion.div
        className="absolute bottom-[5%] right-[5%] h-[40rem] w-[40rem] rounded-full blur-[110px] mix-blend-screen opacity-55"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 150, 0, 0.3) 0%, rgba(212, 110, 0, 0.08) 50%, transparent 70%)",
        }}
        animate={{
          x: [40, -60, 30, 40],
          y: [50, -40, -50, 40],
          scale: [1, 0.85, 1.15, 1],
        }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 5. Vệt sáng quét ngang ống kính (Anamorphic Lens Flare) - Làm dày vệt sáng lên 2px và tăng độ sáng */}
      <motion.div
        className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent blur-[1.5px] mix-blend-screen z-10"
        animate={{
          y: [-80, 80, -80],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 6. Lớp bụi sao Cinematic Particles (Đã nâng cấp số lượng và hiệu ứng phát sáng) */}
      <div className="absolute inset-0 z-10">
        {CINEMATIC_PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-cyan-50"
            style={{
              width: p.size,
              height: p.size,
              left: p.left,
              top: p.top,
              // Tăng hiệu ứng phát sáng lấp lánh quanh viền hạt bụi (Glow Effect)
              boxShadow: `0 0 ${p.size * 2}px rgba(255, 255, 255, 0.95), 0 0 ${p.size * 4}px rgba(0, 245, 255, 0.4)`,
            }}
            animate={{
              x: p.animateX,
              y: p.animateY,
              opacity: p.opacity,
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* 🎯 HỆ THỐNG PHỐI MÀU GRADIENT ĐƯỢC ĐẨY ĐỘ ĐẬM LÊN CỰC ĐẠI */}
      <style>{`
        .auth-cinema-glow {
          background: radial-gradient(65% 65% at 25% 35%, rgba(0, 180, 216, 0.38) 0%, transparent 75%),
                      radial-gradient(55% 55% at 75% 65%, rgba(255, 140, 0, 0.25) 0%, transparent 80%);
          animation: authGradientShift 18s ease-in-out infinite alternate;
        }
        @keyframes authGradientShift {
          0%   { transform: scale(1) translate(0px, 0px) rotate(0deg); }
          50%  { transform: scale(1.1) translate(30px, -20px) rotate(3deg); }
          100% { transform: scale(0.95) translate(-15px, 15px) rotate(-1deg); }
        }
      `}</style>
    </div>
  );
}
