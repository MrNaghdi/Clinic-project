import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { completeProfile } from "../api/users.api";
import { useState } from "react";
import logo from "../../../assets/image/logo.png";

export default function CompleteProfilePage() {
  const navigate = useNavigate();
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const location = useLocation();
  const phone = location.state?.phone;
  const mutation = useMutation({
    mutationFn: () => completeProfile(first_name, last_name),
    onSuccess: (data) => {
      navigate("../profile");
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
          <h1 className="text-xl font-bold text-gray-800">تکمیل اطلاعات</h1>
          <p className="text-gray-500 text-sm mt-1 text-center">
            شماره تلفن:{" "}
            <span className="text-blue-400 font-medium" dir="ltr">
              {phone}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="first_name"
              className="text-sm font-medium text-gray-700"
            >
              نام
            </label>
            <input
              id="first_name"
              type="text"
              placeholder="عرفان"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full h-12 px-4 rounded-full border border-gray-200 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="last_name"
              className="text-sm font-medium text-gray-700"
            >
              نام خانوادگی
            </label>
            <input
              id="last_name"
              type="text"
              placeholder="نقدی مطیع"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full h-12 px-4 rounded-full border border-gray-200 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full h-12 rounded-full bg-blue-400 text-white font-medium cursor-pointer hover:bg-blue-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? "در حال ارسال..." : "ثبت اطلاعات"}
          </button>

          {mutation.isError && (
            <p className="text-red-500 text-sm text-center">
              {mutation.error?.message || "خطایی رخ داد، دوباره تلاش کنید"}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}