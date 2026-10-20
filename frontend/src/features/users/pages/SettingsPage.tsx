import { motion } from "framer-motion";
import { Bell, Mail, Moon, Trash2, Sun } from "lucide-react";
import { useDarkMode } from "../../../shared/hook/useDarkMode";

export default function SettingsPage() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  const Toggle = ({
    checked,
    onChange,
  }: {
    checked: boolean;
    onChange: () => void;
  }) => (
    <button
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
        checked
          ? "bg-gradient-to-r from-brand-500 to-accent-500"
          : "bg-gray-300 dark:bg-gray-600"
      }`}
    >
      <motion.div
        animate={{ x: checked ? 0 : 24 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-md"
      />
    </button>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white mb-1">
          تنظیمات
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          مدیریت اطلاعات و تنظیمات حساب کاربری
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-ink-light p-6 lg:p-8 max-w-2xl space-y-1">
        {/* SMS */}
        <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-500 flex items-center justify-center">
              <Bell size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                اعلان‌های پیامکی
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                دریافت یادآوری نوبت از طریق پیامک
              </p>
            </div>
          </div>
          <Toggle checked={true} onChange={() => {}} />
        </div>

        {/* Email */}
        <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent-50 dark:bg-accent-500/10 text-accent-500 flex items-center justify-center">
              <Mail size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                اعلان‌های ایمیلی
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                دریافت اخبار و پیشنهادات ویژه
              </p>
            </div>
          </div>
          <Toggle checked={false} onChange={() => {}} />
        </div>

        {/* Dark Mode */}
        <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-500 flex items-center justify-center">
              {darkMode ? <Moon size={18} /> : <Sun size={18} />}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                حالت شب
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                داشبورد به حالت تاریک در می‌آید
              </p>
            </div>
          </div>
          <Toggle checked={darkMode} onChange={toggleDarkMode} />
        </div>

        {/* Danger zone */}
        <div className="pt-4">
          <button className="inline-flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-600 transition-colors">
            <Trash2 size={16} />
            حذف حساب کاربری
          </button>
        </div>
      </div>
    </div>
  );
}