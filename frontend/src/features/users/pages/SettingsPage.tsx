import { useDarkMode } from "../../../shared/hook/useDarkMode";

export default function SettingsPage() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  const card = darkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-100";
  const title = darkMode ? "text-white" : "text-gray-800";
  const sub = "text-gray-400";
  const divider = darkMode ? "border-gray-700" : "border-gray-100";

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className={`text-xl sm:text-2xl font-bold ${title}`}>تنظیمات</h1>
        <p className={`text-xs sm:text-sm mt-1 ${sub}`}>
          مدیریت اطلاعات و تنظیمات حساب کاربری
        </p>
      </div>

      <div
        className={`rounded-2xl border p-4 sm:p-6 flex flex-col gap-4 sm:gap-5 w-full max-w-xl transition-colors ${card}`}
      >
        <div className={`flex items-center justify-between gap-4 py-3 border-b ${divider}`}>
          <div className="min-w-0">
            <p className={`text-sm font-medium mb-1 ${title}`}>
              اعلان‌های پیامکی
            </p>
            <p className={`text-xs ${sub}`}>
              دریافت یادآوری نوبت از طریق پیامک
            </p>
          </div>
          <div className="w-11 h-6 rounded-full bg-blue-400 relative cursor-pointer shrink-0">
            <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white" />
          </div>
        </div>

        <div className={`flex items-center justify-between gap-4 py-3 border-b ${divider}`}>
          <div className="min-w-0">
            <p className={`text-sm font-medium mb-1 ${title}`}>
              اعلان‌های ایمیلی
            </p>
            <p className={`text-xs ${sub}`}>
              دریافت اخبار و پیشنهادات ویژه
            </p>
          </div>
          <div className="w-11 h-6 rounded-full bg-gray-200 relative cursor-pointer shrink-0">
            <span className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white" />
          </div>
        </div>

        <div className={`flex items-center justify-between gap-4 py-3 border-b ${divider}`}>
          <div className="min-w-0">
            <p className={`text-sm font-medium mb-1 ${title}`}>حالت شب</p>
            <p className={`text-xs ${sub}`}>
              داشبورد به حالت تاریک در میاد
            </p>
          </div>
          <div
            onClick={toggleDarkMode}
            className={`w-11 h-6 rounded-full relative cursor-pointer shrink-0 transition-colors ${
              darkMode ? "bg-blue-400" : "bg-gray-200"
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                darkMode ? "left-1" : "right-1"
              }`}
            />
          </div>
        </div>

        <button className="text-red-400 text-sm font-medium text-right hover:underline cursor-pointer mt-2">
          حذف حساب کاربری
        </button>
      </div>
    </div>
  );
}