import { BookOpen, Star, Library, Trophy, Target, Bookmark, Zap } from 'lucide-react';

interface IconProps {
  className?: string;
}

export const PageIcon = ({ className = "w-4 h-4 text-text-primary" }: IconProps) => (
  <BookOpen className={className} />
);

export const GenreIcon = ({ className = "w-4 h-4 text-text-primary" }: IconProps) => (
  <Target className={className} />
);

export const FreeIcon = ({ className = "w-4 h-4 text-text-primary" }: IconProps) => (
  <Star className={className} />
);

export const ChaptersIcon = ({ className = "w-4 h-4 text-text-primary" }: IconProps) => (
  <Library className={className} />
);

export const AwardIcon = ({ className = "w-4 h-4 text-text-primary" }: IconProps) => (
  <Trophy className={className} />
);

export const BookIcon = ({ className = "w-4 h-4 text-text-primary" }: IconProps) => (
  <BookOpen className={className} />
);

export const BookmarkIcon = ({ className = "w-4 h-4 text-text-primary" }: IconProps) => (
  <Bookmark className={className} />
);

export const LightningIcon = ({ className = "w-4 h-4 text-text-primary" }: IconProps) => (
  <Zap className={className} />
);

// Convenient export for commonly used icon set
export const MangaIcons = {
  Page: PageIcon,
  Genre: GenreIcon,
  Free: FreeIcon,
  Chapters: ChaptersIcon,
  Award: AwardIcon,
  Book: BookIcon,
  Bookmark: BookmarkIcon,
  Lightning: LightningIcon,
};