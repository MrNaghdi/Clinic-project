import { motion } from "framer-motion";
import { Users, Sparkles, Shield, Headphones } from "lucide-react";
import clinicImage from "../../assets/image/clinic.jpg";
import { useDarkMode } from "../hook/useDarkMode";
import { Container } from "./ui/Container";
import { SectionTitle } from "./ui/SectionTitle";
import { RevealOnScroll } from "./animations/RevealOnScroll";

const whyUs = [
  {
    icon: Users,
    title: "متخصصان مجرب",
    description: "پزشکان و متخصصان با سال‌ها تجربه در کنار شما",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Sparkles,
    title: "تجهیزات مدرن",
    description: "جدیدترین دستگاه‌های روز دنیا با استاندارد بین‌المللی",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Shield,
    title: "محیط بهداشتی",
    description: "کلینیکی تمیز و آرامش‌بخش برای بهترین تجربه شما",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Headphones,
    title: "پشتیبانی آنلاین",
    description: "مشاوره رایگان قبل از نوبت و پاسخگویی سریع",
    color: "from-orange-500 to-red-500",
  },
];

const WhyUsSection = () => {
  const { darkMode } = useDarkMode();

  return (
    <section
      dir="rtl"
      className={`relative py-20 lg:py-28 overflow-hidden ${darkMode ? "bg-ink" : "bg-white"}`}
    >
      <div
        className={`absolute top-1/2 right-0 w-[600px] h-[600px] blur-[120px] rounded-full pointer-events-none ${
          darkMode ? "bg-accent-500/10" : "bg-accent-200/30"
        }`}
      />

      <Container className="relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Right side — Image (RTL) */}
          <RevealOnScroll direction="right">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-accent-500 rounded-3xl rotate-3 opacity-30 blur-2xl" />

              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={clinicImage}
                  alt="clinic"
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="absolute -bottom-6 -left-6 bg-white dark:bg-ink-light rounded-2xl p-5 shadow-2xl border border-gray-200 dark:border-white/10"
              >
                <p className="text-3xl font-black text-brand-500">۱۰+</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">سال تجربه</p>
              </motion.div>
            </div>
          </RevealOnScroll>

          {/* Left side — Content */}
          <div>
            <SectionTitle
              eyebrow="چرا ما؟"
              title="چرا کلینیک SkinCare؟"
              description="ما به زیبایی شما اهمیت می‌دهیم و بهترین خدمات را ارائه می‌دهیم"
              align="right"
              className="mb-10"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {whyUs.map((item, index) => {
                const Icon = item.icon;
                return (
                  <RevealOnScroll key={item.title} delay={index * 0.1}>
                    <motion.div
                      whileHover={{ y: -6, scale: 1.02 }}
                      className="group relative p-5 rounded-2xl bg-white dark:bg-ink-light border border-gray-200 dark:border-white/5 hover:border-transparent transition-all overflow-hidden hover:shadow-xl"
                    >
                      <div
                        className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${item.color} opacity-10 group-hover:opacity-30 blur-2xl transition-opacity duration-500`}
                      />

                      <div className="relative">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center mb-4 shadow-lg`}
                        >
                          <Icon size={20} />
                        </div>
                        <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1.5">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-5">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  </RevealOnScroll>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default WhyUsSection;