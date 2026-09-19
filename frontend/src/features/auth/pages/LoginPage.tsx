import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "../api/auth.api";
import logo from "../../../assets/image/logo.png";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: sendOtp,
    onSuccess: (data) => {
      navigate("/verify-otp", { state: { phone } });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(phone);
  };

  return (
    <div
      dir="rtl"
      className="w-full min-h-screen bg-linear-to-r from-blue-50 to-blue-300 flex items-center justify-center px-4"
    >
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        {/* لوگو */}
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="SkinCare" className="w-14 h-14 mb-3" />
          <h1 className="text-xl font-bold text-gray-800">
            ورود به SkinCare
          </h1>
          <p className="text-gray-500 text-sm mt-1 text-center">
            برای دریافت کد تایید، شماره تلفن خود را وارد کنید
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="phoneInput"
              className="text-sm font-medium text-gray-700"
            >
              شماره تلفن
            </label>
            <input
              id="phoneInput"
              type="text"
              inputMode="decimal"
              placeholder="09123456789"
              name="phoneInput"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-12 px-4 rounded-full border border-gray-200 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors"
              dir="ltr"
              style={{ textAlign: "right" }}
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full h-12 rounded-full bg-blue-400 text-white font-medium cursor-pointer hover:bg-blue-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? "در حال ارسال..." : "ارسال کد"}
          </button>

          {mutation.isError && (
            <p className="text-red-500 text-sm text-center">
              {mutation.error?.message || "خطایی رخ داد، دوباره تلاش کنید"}
            </p>
          )}
        </form>

        <p className="text-xs text-gray-400 text-center mt-6 leading-6">
          با ورود به سایت، شما{" "}
          <a href="" className="text-blue-400 hover:underline">
            قوانین و مقررات
          </a>{" "}
          را می‌پذیرید.
        </p>
      </div>
    </div>
  );
}