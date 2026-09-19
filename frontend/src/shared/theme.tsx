export const homeTheme = (dark: boolean) => ({
    pageBg: dark ? "bg-gray-900" : "bg-gray-50",
    pageBgBlue: dark ? "bg-gray-900" : "bg-blue-50",
    headerBg: dark
      ? "bg-gray-900/80 border-gray-800"
      : "bg-white/80 border-gray-100",
    cardBg: dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100",
    cardGradient: dark
      ? "bg-gray-800 border-gray-700"
      : "bg-linear-to-t to-blue-50 bg-white border-gray-100",
    searchPanel: dark
      ? "bg-gray-900/95 border-gray-800"
      : "bg-white/95 border-gray-100",
    mobileMenu: dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100",
    inputBg: dark
      ? "bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-blue-500 focus:bg-gray-800"
      : "bg-gray-50 border-gray-100 text-gray-700 placeholder:text-gray-400 focus:border-blue-400 focus:bg-white",
  
    titleText: dark ? "text-white" : "text-gray-800",
    bodyText: dark ? "text-gray-300" : "text-gray-600",
    mutedText: dark ? "text-gray-400" : "text-gray-500",
  
    primaryBtn: "bg-blue-400 hover:bg-blue-500 text-white",
    outlineBtn: dark
      ? "border-blue-500 text-blue-400 hover:bg-blue-500/10"
      : "border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white",
    iconBtn: dark
      ? "text-gray-400 hover:text-blue-400 hover:bg-blue-500/10"
      : "text-gray-500 hover:text-blue-400 hover:bg-blue-50",
    iconBtnActive: dark
      ? "bg-blue-500/20 text-blue-400"
      : "bg-blue-50 text-blue-500",
    scrollBtn: dark
      ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-100",
  
    chip: dark
      ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-blue-500/20 hover:border-blue-500/50 hover:text-blue-300"
      : "bg-gray-50 border-gray-100 text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-500",
    iconCircle: dark
      ? "bg-blue-500/20 text-blue-400"
      : "bg-blue-50 text-blue-400",
    iconCirclePurple: dark
      ? "bg-purple-500/20 text-purple-400"
      : "bg-purple-50 text-purple-400",
  
    divider: dark ? "border-gray-700" : "border-gray-100",
    dividerFaint: dark ? "border-gray-800" : "border-gray-50",
  
    footerBg: dark ? "bg-black" : "bg-[#0f2a4a]",
  });