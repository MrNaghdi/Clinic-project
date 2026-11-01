export const JALALI_MONTHS = [
    "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
  ];
  
  export const WEEK_DAYS_FULL = [
    "شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه",
  ];
  
  function gregorianToJalali(gy: number, gm: number, gd: number) {
    const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    let jy = gy <= 1600 ? 0 : 979;
    gy -= gy <= 1600 ? 621 : 1600;
    const gy2 = gm > 2 ? gy + 1 : gy;
    let days =
      365 * gy +
      Math.floor((gy2 + 3) / 4) -
      Math.floor((gy2 + 99) / 100) +
      Math.floor((gy2 + 399) / 400) -
      80 +
      gd +
      g_d_m[gm - 1];
    jy += 33 * Math.floor(days / 12053);
    days %= 12053;
    jy += 4 * Math.floor(days / 1461);
    days %= 1461;
    if (days > 365) {
      jy += Math.floor((days - 1) / 365);
      days = (days - 1) % 365;
    }
    const jm = days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
    const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
    return { jy, jm, jd };
  }
  
  export function getJalaliInfo(isoDate: string) {
    const [y, m, d] = isoDate.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    const { jy, jm, jd } = gregorianToJalali(y, m, d);
    const weekday = (date.getDay() + 1) % 7;
    return {
      day: jd,
      month: jm,
      year: jy,
      monthName: JALALI_MONTHS[jm - 1],
      weekday,
      weekdayFull: WEEK_DAYS_FULL[weekday],
      shortDate: `${jd} ${JALALI_MONTHS[jm - 1]}`,
      fullDate: `${jd} ${JALALI_MONTHS[jm - 1]} ${jy}`,
    };
  }
  
  export function getRelativeLabel(isoDate: string): string | null {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(isoDate);
    date.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "امروز";
    if (diffDays === 1) return "فردا";
    if (diffDays === 2) return "پس‌فردا";
    return null;
  }
  
  export function isPast(isoDate: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(isoDate);
    date.setHours(0, 0, 0, 0);
    return date < today;
  }
  
  export function getTodayISO(): string {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  }