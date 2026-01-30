import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, BookOpen } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShareButtons } from "@/components/ShareButtons";
import { supabase } from "@/integrations/supabase/client";

interface BestPractice {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  slug: string;
  category: string;
  cover_image_url: string | null;
  author_name: string;
  published_at: string | null;
  created_at: string;
}

const categoryLabels: Record<string, string> = {
  allgemein: "Allgemein",
  foerderung: "Förderung",
  veranstaltung: "Veranstaltungen",
  kommunikation: "Kommunikation",
  organisation: "Organisation",
  recht: "Recht & Finanzen",
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BestPracticeDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [practice, setPractice] = useState<BestPractice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchPractice() {
      if (!slug) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("best_practices")
          .select("*")
          .eq("slug", slug)
          .eq("is_published", true)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          setNotFound(true);
        } else {
          setPractice(data);
        }
      } catch (error) {
        console.error("Error fetching best practice:", error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPractice();
  }, [slug]);

  if (isLoading) {
    return (
      <Layout>
        <section className="py-16 lg:py-24 bg-gradient-section">
          <div className="container max-w-4xl">
            <Skeleton className="h-4 w-32 mb-8" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-12 w-3/4 mb-6" />
            <div className="flex gap-4">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
        </section>
        <section className="py-16 lg:py-24 bg-background">
          <div className="container max-w-4xl space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </section>
      </Layout>
    );
  }

  if (notFound) {
    return (
      <Layout>
        <section className="py-16 lg:py-24 bg-gradient-section">
          <div className="container text-center">
            <BookOpen className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
            <h1 className="font-display text-4xl font-bold text-foreground mb-4">
              Leitfaden nicht gefunden
            </h1>
            <p className="text-muted-foreground mb-8">
              Der gewünschte Leitfaden konnte nicht gefunden werden.
            </p>
            <Button asChild>
              <Link to="/best-practices">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Zurück zu Best Practices
              </Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-gradient-section">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/best-practices"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zu Best Practices
            </Link>

            <Badge variant="secondary" className="mb-4">
              {categoryLabels[practice?.category || ""] || practice?.category}
            </Badge>

            <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl mb-6">
              {practice?.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(practice?.published_at || practice?.created_at || "")}
                </span>
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {practice?.author_name}
                </span>
              </div>
              <ShareButtons
                title={practice?.title || ""}
                description={practice?.excerpt || ""}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cover Image */}
      {practice?.cover_image_url && (
        <section className="bg-background">
          <div className="container max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="-mt-8 mb-12"
            >
              <img
                src={practice.cover_image_url}
                alt={practice.title}
                className="w-full rounded-xl shadow-card object-cover aspect-video"
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-lg max-w-none"
          >
            {practice?.content.split("\n\n").map((paragraph, index) => (
              <p key={index} className="text-muted-foreground leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </motion.div>

          {/* Footer with Share and Back */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 pt-8 border-t border-border flex flex-wrap items-center justify-between gap-4"
          >
            <Button variant="outline" asChild>
              <Link to="/best-practices">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Alle Leitfäden anzeigen
              </Link>
            </Button>
            <ShareButtons
              title={practice?.title || ""}
              description={practice?.excerpt || ""}
              variant="inline"
            />
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
