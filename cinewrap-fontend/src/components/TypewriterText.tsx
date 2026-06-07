//Hiệu ứng chuyển động gõ chữ đánh máy
import React from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

// Định nghĩa kiểu dữ liệu (Interface) cho các props đầu vào
interface TypewriterTextProps {
  text: string;
  className?: string;
  delayStart?: number;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  className = "",
  delayStart = 0,
}) => {
  // Chuyển chuỗi văn bản thành mảng ký tự để dễ dàng áp dụng hiệu ứng
  const letters = Array.from(text);

  // Cấu hình Variants cho hiệu ứng gõ chữ với kiểu dữ liệu của Framer Motion
  const containerVariants: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delayStart, // Thời gian chờ trước khi bắt đầu gõ chữ
        staggerChildren: 0.03, // Thời gian giữa các ký tự được gõ
      },
    },
  };

  const childVariants: Variants = {
    hidden: { opacity: 0, display: "inline-block" },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.01,
      },
    },
  };

  return (
    <motion.p
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {letters.map((letter, index) => (
        <motion.span key={index} variants={childVariants}>
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.p>
  );
};
