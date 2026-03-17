import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Target, FileCheck, Megaphone, Palette } from "lucide-react";

const workingGroups = [
  {
    icon: Target,
    name: "AG Kulturpolitik",
    desc: "Stellungnahmen & politische Vertretung",
    members: 12,
  },
  {
    icon: FileCheck,
    name: "AG Förderung",
    desc: "Förderinfos & Antrags-Workshops",
    members: 8,
  },
  {
    icon: Megaphone,
    name: "AG Öffentlichkeitsarbeit",
    desc: "Website, Social Media & PR",
    members: 6,
  },
  {
    icon: Palette,
    name: "AG Ressourcen",
    desc: "Ressourcenpool & neue Angebote",
    members: 5,
  },
];

export default function WorkingGroupsSection() {
  return (
    <section className="py-24 lg:py-36 bg-muted/20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14"
        >
          <div>
            <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground tracking-tight leading-[1.05]">
              Arbeits
              <span className="text-gradient">gruppen</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl">
              In unseren AGs gestaltest du aktiv mit – von Kulturpolitik bis Öffentlichkeitsarbeit.
            </p>
          </div>
          <Link
            to="/mitmachen"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity shrink-0"
          >
            Alle AGs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {workingGroups.map((ag, index) => (
            <motion.div
              key={ag.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Link
                to="/mitmachen"
                className="group block h-full p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-glow transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <ag.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                  {ag.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{ag.desc}</p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="font-display font-bold text-primary text-base">{ag.members}</span>
                  Mitglieder
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
