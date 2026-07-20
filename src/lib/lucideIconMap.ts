import {
  Target,
  Eye,
  Hammer,
  Flag,
  Lightbulb,
  Layers,
  Blocks,
  Sparkles,
  Rocket,
  ShieldCheck,
  Users,
  Heart,
  Compass,
  Zap,
  Star,
  Award,
  Globe,
  Code,
  Brain,
  TrendingUp,
  CheckCircle,
  Handshake,
  Puzzle,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Target,
  Eye,
  Hammer,
  Flag,
  Lightbulb,
  Layers,
  Blocks,
  Sparkles,
  Rocket,
  ShieldCheck,
  Users,
  Heart,
  Compass,
  Zap,
  Star,
  Award,
  Globe,
  Code,
  Brain,
  TrendingUp,
  CheckCircle,
  Handshake,
  Puzzle,
};

/** Looks up a curated Lucide icon by name (as typed by an admin), falling back to Sparkles. */
export function getLucideIcon(name: string | undefined | null): LucideIcon {
  if (!name) return Sparkles;
  return iconMap[name] ?? Sparkles;
}
