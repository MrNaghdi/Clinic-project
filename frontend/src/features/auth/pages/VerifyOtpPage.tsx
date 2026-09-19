import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp } from "../api/auth.api";
import logo from "../../../assets/image/logo.png";

export default function VerifyOtpPage() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone;
  const mutation = useMutation({
    mutationFn: () => verifyOtp(phone, code),
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      if (data.purpose === "login") {
        navigate("../profile");
      } else {
        navigate("../complete-profile", { state: { phone } });
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div
      dir="rtl"
      className="w-full min-h-screen bg-linear-to-r from-blue-50 to-blue-300 flex items-center justify-center px-4"
    >
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="SkinCare" className="w-14 h-14 mb-3" />
          <h1 className="text-xl font-bold text-gray-800">تایید شماره تلفن</h1>
          <p className="text-gray-500 text-sm mt-1 text-center">
            کد ارسال شده به شماره{" "}
            <span className="text-blue-400 font-medium" dir="ltr">
              {phone}
            </span>{" "}
            را وارد کنید
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="codeInput"
              className="text-sm font-medium text-gray-700"
            >
              کد تایید
            </label>
            <input
              id="codeInput"
              type="text"
              inputMode="decimal"
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-12 px-4 rounded-full border border-gray-200 text-gray-700 text-center tracking-widest placeholder:text-gray-400 placeholder:tracking-normal focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors"
              dir="ltr"
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full h-12 rounded-full bg-blue-400 text-white font-medium cursor-pointer hover:bg-blue-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? "در حال ارسال..." : "تایید کد"}
          </button>

          {mutation.isError && (
            <p className="text-red-500 text-sm text-center">
              {mutation.error?.message || "کد وارد شده صحیح نیست"}
            </p>
          )}
        </form>

        <button
          onClick={() => navigate(-1)}
          className="w-full text-center text-sm text-gray-400 hover:text-blue-400 transition-colors mt-6 cursor-pointer"
        >
          ویرایش شماره تلفن
        </button>
      </div>
    </div>
  );
}