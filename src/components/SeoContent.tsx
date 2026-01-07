interface SeoContentProps {
  chapterId?: string;
  chapterTitle?: string;
  keywords?: string[];
  aboutSection?: string | string[];
  mangaTitle?: string;
}

export default function SeoContent({ chapterId, chapterTitle, keywords = [], aboutSection, mangaTitle = "Manga" }: SeoContentProps) {
  // Early return if no content to display
  if (!aboutSection && keywords.length === 0) {
    return null;
  }

  // Ensure aboutSection is always an array for mapping
  const aboutParagraphs = Array.isArray(aboutSection) ? aboutSection : (aboutSection ? [aboutSection] : []);

  return (
    <div className="mt-12 bg-surface-secondary border border-border-default rounded-lg p-6 text-text-secondary">
      <div className="max-w-3xl mx-auto">
        {/* Chapter-specific or General About Section */}
        {aboutParagraphs.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              {chapterId && chapterTitle ? chapterTitle : `About ${mangaTitle}`}
            </h2>
            <div className="prose-lg max-w-none" suppressHydrationWarning={true}>
              {aboutParagraphs.map((paragraph, index) => (
                <div key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
              ))}
            </div>
          </section>
        )}

        {/* SEO Keywords Section */}
        {keywords.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold text-text-primary mb-3">Related Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {keywords.map((term, index) => (
                <span
                  key={index}
                  className="bg-surface-elevated text-text-secondary px-3 py-1 rounded-full text-sm border border-border-default"
                >
                  {term}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}