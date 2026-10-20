export const homeTheme = (dark: boolean) => ({
  // ── background
  pageBg: dark ? "bg-ink" : "bg-white",
  pageBgMuted: dark ? "bg-ink-light" : "bg-gray-50",
  sectionBg: dark ? "bg-ink" : "bg-white",
  headerBg: dark
    ? "bg-ink/80 border-white/5"
    : "bg-white/80 border-gray-200/60",
  cardBg: dark ? "bg-ink-light border-white/5" : "bg-white border-gray-200/60",
  cardHover: dark
    ? "hover:border-white/10 hover:bg-ink-softer"
    : "hover:border-gray-300 hover:shadow-lg",
  cardGlass: dark
    ? "bg-white/[0.03] border-white/[0.06] backdrop-blur-xl"
    : "bg-white/70 border-gray-200/60 backdrop-blur-xl",

  // ── text
  titleText: dark ? "text-white" : "text-gray-900",
  bodyText: dark ? "text-gray-300" : "text-gray-700",
  mutedText: dark ? "text-gray-400" : "text-gray-500",
  faintText: dark ? "text-gray-500" : "text-gray-400",

  // ── input
  inputBg: dark
    ? "bg-ink-light border-white/10 text-white placeholder:text-gray-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
    : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:bg-white",

  // ── button
  primaryBtn: dark
    ? "bg-white text-ink hover:bg-gray-100"
    : "bg-gray-900 text-white hover:bg-gray-800",
  brandBtn:
    "bg-gradient-to-r from-brand-500 to-accent-500 text-white hover:from-brand-600 hover:to-accent-600 shadow-lg shadow-brand-500/25",
  outlineBtn: dark
    ? "border border-white/20 text-white hover:bg-white/5"
    : "border border-gray-300 text-gray-900 hover:bg-gray-50",
  ghostBtn: dark
    ? "text-gray-400 hover:text-white hover:bg-white/5"
    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",

  // ── icon
  iconBg: dark
    ? "bg-brand-500/10 text-brand-400 ring-1 ring-brand-500/20"
    : "bg-brand-50 text-brand-600 ring-1 ring-brand-100",
  iconBgAccent: dark
    ? "bg-accent-500/10 text-accent-400 ring-1 ring-accent-500/20"
    : "bg-accent-50 text-accent-600 ring-1 ring-accent-100",

  // ── divider
  divider: dark ? "border-white/5" : "border-gray-200/60",

  // ── footer
  footerBg: "bg-ink",

  // ── badge
  badgeBrand: dark
    ? "bg-brand-500/10 text-brand-400 ring-1 ring-brand-500/20"
    : "bg-brand-50 text-brand-600 ring-1 ring-brand-100",
  badgeSuccess: dark
    ? "bg-green-500/10 text-green-400 ring-1 ring-green-500/20"
    : "bg-green-50 text-green-600 ring-1 ring-green-100",
  badgeDanger: dark
    ? "bg-red-500/10 text-red-400 ring-1 ring-red-500/20"
    : "bg-red-50 text-red-600 ring-1 ring-red-100",
});