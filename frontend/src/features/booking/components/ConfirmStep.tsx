import {
  Calendar,
  Clock,
  Scissors,
  CheckCircle2,
  ShieldCheck,
  MessageSquare,
  ChevronLeft,
} from "lucide-react";
import { getJalaliInfo } from "../utils/date";
import type { Service } from "../../services/api/services.api";
import type { Specialist } from "../../specialists/api/specialists.api";

interface ConfirmStepProps {
  service: Service;
  specialist: Specialist;
  date: string;
  time: string;
  onNext: () => void;
  onBack: () => void;
}

export function ConfirmStep({
  service,
  specialist,
  date,
  time,
  onNext,
  onBack,
}: ConfirmStepProps) {
  const fullName = `${specialist.user?.first_name ?? ""} ${
    specialist.user?.last_name ?? ""
  }`.trim();
  const jalaliInfo = getJalaliInfo(date);
  const imageUrl = specialist.user?.profile_image
    ? `http://localhost:3000${specialist.user.profile_image}`
    : null;

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white mb-2">
          تایید نهایی
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          اطلاعات نوبت خود را بررسی کنید
        </p>
      </div>

      <div className="max-w-lg mx-auto">
        <div className="rounded-3xl overflow-hidden bg-white dark:bg-ink-light border border-gray-200 dark:border-white/10 shadow-2xl shadow-brand-500/5">
          <div className="relative bg-gradient-to-br from-brand-500 to-accent-500 p-6 text-white">
            <div className="flex items-center gap-4">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={fullName}
                  className="w-16 h-16 rounded-full object-cover border-4 border-white/40 shadow-lg shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center text-2xl font-black border-4 border-white/40 shrink-0">
                  {specialist.user?.first_name?.[0]}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-white/80 text-xs mb-1">نوبت شما با</p>
                <h3 className="text-xl font-black text-white truncate">
                  {fullName}
                </h3>
                <p className="text-white/80 text-sm">متخصص پوست و زیبایی</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-white/5">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
                <Scissors size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400">خدمت</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {service.name}
                </p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                {service.duration_minutes} دقیقه
              </p>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-white/5">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
                <Calendar size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400">تاریخ</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {jalaliInfo.weekdayFull} {jalaliInfo.fullDate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-white/5">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                <Clock size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400">ساعت</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {time}
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6">
            <div className="rounded-2xl bg-gradient-to-l from-brand-500/10 via-accent-500/10 to-brand-500/10 border border-brand-500/20 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  مبلغ قابل پرداخت
                </p>
                <p className="text-2xl font-black text-brand-500">
                  {service.price.toLocaleString("fa-IR")}
                  <span className="text-sm font-normal mr-1 text-gray-600 dark:text-gray-400">
                    تومان
                  </span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-brand-500/20 text-brand-500 flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>
            </div>
          </div>

          <div className="px-6 pb-6 flex flex-wrap gap-2 justify-center">
            <div className="inline-flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-white/5">
              <CheckCircle2 size={12} className="text-green-500" />
              لغو رایگان
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-white/5">
              <MessageSquare size={12} className="text-blue-500" />
              پیامک یادآوری
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-white/5">
              <ShieldCheck size={12} className="text-brand-500" />
              پرداخت امن
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={onBack}
            className="h-12 px-6 rounded-2xl border-2 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            مرحله قبل
          </button>
          <button
            onClick={onNext}
            className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-500 text-white font-bold shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 flex items-center justify-center gap-2"
          >
            ادامه به پرداخت
            <ChevronLeft size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}