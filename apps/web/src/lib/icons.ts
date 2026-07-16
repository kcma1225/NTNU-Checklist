import {
  BookOpen,
  Building2,
  CalendarDays,
  ClipboardList,
  FileText,
  GraduationCap,
  Globe,
  Link as LinkIcon,
  MapPin,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { LinkIcon as LinkIconName } from "@ntnu-guide/shared";

const ICONS: Record<LinkIconName, LucideIcon> = {
  "graduation-cap": GraduationCap,
  "book-open": BookOpen,
  "calendar-days": CalendarDays,
  wallet: Wallet,
  "file-text": FileText,
  "map-pin": MapPin,
  globe: Globe,
  "clipboard-list": ClipboardList,
  "building-2": Building2,
  link: LinkIcon,
};

export function getLinkIcon(name: LinkIconName): LucideIcon {
  return ICONS[name] ?? LinkIcon;
}
