import { motion } from "framer-motion";
import { Sparkles, Shield, Users, Heart } from "lucide-react";
import { Container } from "../ui/Container";
import { SectionTitle } from "../ui/SectionTitle";
import { RevealOnScroll } from "../animations/RevealOnScroll";

const features = [
  {
    icon: Users,
    title: "متخصصان مجرب",
    description: "تیمی از بهترین پزشکان با سال‌ها تجربه",
    color: "from-brand-500 to-blue-600",
  },
  {
    icon: Shield,
    title: "تجهیزات مدرن",
    description: "جدیدترین دستگاه‌های روز دنیا",
    color: "from-accent-500 to-cyan-600",
  },
  {
    icon: Sparkles,
    title: "محیط بهداشتی",
    description: "فضایی آرام و استریل برای آسایش شما",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Heart,
    title: "پشتیبانی ۲۴/۷",
    description: "همیشه در کنار شماییم",
    color: "from-rose-500 to-red-500",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-white dark:bg-ink relative overflow-hidden">
      <Container>
        <SectionTitle
          eyebrow="مزایای ما"
          title="چرا SkinCare؟"
          description="تجربه‌ای متفاوت از زیبایی با استانداردهای جهانی"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <RevealOnScroll key={feature.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="group relative h-full rounded-3xl border border-gray-200 dark:border-white/5 bg-white dark:bg-ink-light p-8 overflow-hidden hover:border-transparent transition-colors"
                >
                  {/* Gradient hover overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:bg-white/20 group-hover:shadow-none transition-all`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white group-hover:text-white transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-white/90 transition-colors leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              </RevealOnScroll>
            );
          })}
        </div>
      </Container>
    </section>
  );
}