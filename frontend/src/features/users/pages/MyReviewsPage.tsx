import { useDarkMode } from "../../../shared/hook/useDarkMode";
import { MyReviewsList } from "../../reviews/components/MyReviewsList";

export default function MyReviewsPage() {
  const { darkMode } = useDarkMode();

  return (
    <div className="space-y-6">
      <div>
        <h1
          className={`text-2xl font-black mb-1 ${
            darkMode ? "text-white" : "text-slate-900"
          }`}
        >
          نظرات من
        </h1>
        <p
          className={`text-sm ${
            darkMode ? "text-white/50" : "text-slate-500"
          }`}
        >
          نظراتی که برای خدمات و متخصصان ثبت کرده‌اید
        </p>
      </div>

      <MyReviewsList />
    </div>
  );
}