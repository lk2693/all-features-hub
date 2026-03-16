import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Users, Calendar, Folder } from "lucide-react";

const stats = [
  { label: "Mitglieder", value: "120+", icon: Users },
  { label: "Events / Jahr", value: "50+", icon: Calendar },
  { label: "Ressourcen", value: "80+", icon: Folder },
];

export default function StatsCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  return (
    <section ref={ref} className="relative py-24 lg:py-32 overflow-hidden">
      {/* Parallax background pattern */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 bg-tertiary"
      >
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary-foreground)) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }} />
      </motion.div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: index * 0.15, ease: [0.25, 0.1, 0, 1] }}
              className="text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-4 opacity-80" />
                <div className="font-display text-6xl lg:text-7xl font-bold text-tertiary-foreground tracking-tight">
                  {stat.value}
                </div>
                <p className="mt-2 text-lg text-tertiary-foreground/60 font-medium">
                  {stat.label}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
