import React, { useState } from "react";

interface RatingModalProps {
  isOpen: boolean;
  movieTitle: string;
  initialRating: number | null;
  onClose: () => void;
  onSubmit: (score: number) => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  movieTitle,
  initialRating,
  onClose,
  onSubmit,
}) => {
  const [hoverRating, setHoverRating] = useState<number>(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-sm rounded-2xl bg-[#131c2e] border border-white/10 p-6 shadow-2xl space-y-4 text-center">
        <h3 className="text-lg font-black text-white">Đánh Giá Bộ Phim</h3>
        <p className="text-xs text-[#9ca3af]">
          Chia sẻ cảm nhận của bạn về{" "}
          <span className="text-white font-semibold">{movieTitle}</span>
        </p>

        {/* Dải 10 ngôi sao */}
        <div className="flex items-center justify-center gap-1 py-2">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => onSubmit(star)}
              className="text-lg transition transform hover:scale-125 cursor-pointer"
            >
              <span
                className={
                  star <= (hoverRating || initialRating || 0)
                    ? "text-[#ffc107]"
                    : "text-white/20"
                }
              >
                ★
              </span>
            </button>
          ))}
        </div>

        <p className="text-sm font-bold text-[#ffc107]">
          {hoverRating || initialRating || 0} / 10 Điểm
        </p>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-bold text-white hover:bg-white/10 transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
