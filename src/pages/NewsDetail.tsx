import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShareButtons } from "@/components/ShareButtons";
import { supabase } from "@/integrations/supabase/client";

interface NewsPost {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  slug: string;
  cover_image_url: string | null;
  author_name: string;
  published_at: string | null;
  created_at: string;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function NewsDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<NewsPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("news_posts")
          .select("*")
          .eq("slug", slug)
          .eq("is_published", true)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          setNotFound(true);
        } else {
          setPost(data);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPost();
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
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
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
            <h1 className="font-display text-4xl font-bold text-foreground mb-4">
              Artikel nicht gefunden
            </h1>
            <p className="text-muted-foreground mb-8">
              Der gewünschte Artikel konnte nicht gefunden werden.
            </p>
            <Button asChild>
              <Link to="/news">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Zurück zu News
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
              to="/news"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zu News
            </Link>

            <Badge variant="secondary" className="mb-4">
              News
            </Badge>

            <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl mb-6">
              {post?.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(post?.published_at || post?.created_at || "")}
                </span>
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {post?.author_name}
                </span>
              </div>
              <ShareButtons
                title={post?.title || ""}
                description={post?.excerpt || ""}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cover Image */}
      {post?.cover_image_url && (
        <section className="bg-background">
          <div className="container max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="-mt-8 mb-12"
            >
              <img
                src={post.cover_image_url}
                alt={post.title}
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
            {/* Render content - in a real CMS you might use markdown or rich text */}
            {post?.content.split("\n\n").map((paragraph, index) => (
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
              <Link to="/news">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Alle News anzeigen
              </Link>
            </Button>
            <ShareButtons
              title={post?.title || ""}
              description={post?.excerpt || ""}
              variant="inline"
            />
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
