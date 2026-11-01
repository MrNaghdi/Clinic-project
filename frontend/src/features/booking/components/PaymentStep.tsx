import { useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Wallet,
  ShieldCheck,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export type PaymentMethod = "online" | "cash";

interface PaymentStepProps {
  amount: number;
  onConfirm: (method: PaymentMethod) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export function PaymentStep({
  amount,
  onConfirm,
  onBack,
  isSubmitting,
}: PaymentStepProps) {
  const [method, setMethod] = useState<PaymentMethod>("online");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = async () => {
    if (method === "cash") {
      onConfirm("cash");
      return;
    }

    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsProcessing(false);
    onConfirm("online");
  };

  const isLoading = isProcessing || isSubmitting;

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white mb-2">
          پرداخت
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          روش پرداخت خود را انتخاب کنید
        </p>
      </div>

      <div className="max-w-lg mx-auto">
        <div className="rounded-3xl bg-gradient-to-br from-brand-500 to-accent-500 p-6 text-white text-center mb-6 shadow-xl shadow-brand-500/20">
          <p className="text-white/80 text-sm mb-2">مبلغ قابل پرداخت</p>
          <p className="text-4xl font-black">
            {amount.toLocaleString("fa-IR")}
            <span className="text-base font-normal mr-2">تومان</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <motion.button
            type="button"
            whileHover={{ y: -2 }}
            onClick={() => setMethod("online")}
            disabled={isLoading}
            className={`
              p-5 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all disabled:opacity-50
              ${
                method === "online"
                  ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10 shadow-lg shadow-brand-500/10"
                  : "border-gray-200 dark:border-white/10 bg-white dark:bg-ink-light hover:border-brand-300"
              }
            `}
          >
            <div
              className={`
                w-14 h-14 rounded-2xl flex items-center justify-center
                ${
                  method === "online"
                    ? "bg-gradient-to-br from-brand-500 to-accent-500 text-white"
                    : "bg-gray-100 dark:bg-white/10 text-gray-400"
                }
              `}
            >
              <CreditCard size={24} />
            </div>
            <div className="text-center">
              <p
                className={`text-sm font-bold ${
                  method === "online"
                    ? "text-brand-600 dark:text-brand-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                پرداخت آنلاین
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                کارت بانکی
              </p>
            </div>
            {method === "online" && (
              <CheckCircle2
                size={16}
                className="text-brand-500"
                fill="currentColor"
              />
            )}
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ y: -2 }}
            onClick={() => setMethod("cash")}
            disabled={isLoading}
            className={`
              p-5 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all disabled:opacity-50
              ${
                method === "cash"
                  ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10 shadow-lg shadow-brand-500/10"
                  : "border-gray-200 dark:border-white/10 bg-white dark:bg-ink-light hover:border-brand-300"
              }
            `}
          >
            <div
              className={`
                w-14 h-14 rounded-2xl flex items-center justify-center
                ${
                  method === "cash"
                    ? "bg-gradient-to-br from-brand-500 to-accent-500 text-white"
                    : "bg-gray-100 dark:bg-white/10 text-gray-400"
                }
              `}
            >
              <Wallet size={24} />
            </div>
            <div className="text-center">
              <p
                className={`text-sm font-bold ${
                  method === "cash"
                    ? "text-brand-600 dark:text-brand-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                پرداخت در محل
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                نقدی یا کارت
              </p>
            </div>
            {method === "cash" && (
              <CheckCircle2
                size={16}
                className="text-brand-500"
                fill="currentColor"
              />
            )}
          </motion.button>
        </div>

        {/* Trust */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-6">
          <ShieldCheck size={14} className="text-green-500" />
          پرداخت امن — اطلاعات شما محفوظ است
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onBack}
            disabled={isLoading}
            className="h-12 px-6 rounded-2xl border-2 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            مرحله قبل
          </button>
          <button
            onClick={handlePay}
            disabled={isLoading}
            className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-500 text-white font-bold shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {isProcessing
                  ? "در حال اتصال به درگاه..."
                  : "در حال ثبت نوبت..."}
              </>
            ) : method === "online" ? (
              <>
                <CreditCard size={18} />
                پرداخت {amount.toLocaleString("fa-IR")} تومان
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                ثبت نوبت (پرداخت در محل)
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}