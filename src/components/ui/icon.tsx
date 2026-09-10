import {
  Accessibility,
  ArrowUpDown,
  Baby,
  BadgeCheck,
  Banknote,
  Bike,
  Bookmark,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock,
  CreditCard,
  Croissant,
  ExternalLink,
  Filter,
  Globe,
  House,
  Image as ImageIcon,
  Info,
  Languages,
  List,
  Map as MapIcon,
  MapPin,
  Medal,
  Menu,
  Moon,
  Mountain,
  Navigation,
  Phone,
  Scissors,
  Search,
  ShieldCheck,
  Siren,
  SquareParking,
  Star,
  ThumbsUp,
  Trees,
  TriangleAlert,
  Trophy,
  Umbrella,
  User,
  Users,
  Utensils,
  Wifi,
  X,
  type LucideIcon,
} from "lucide-react";

/**
 * Ikonka registri.
 *
 * Ma'lumotlar bazasida faqat ikonka kaliti saqlanadi (`icon: "utensils"`),
 * uni komponentga bog'lash — UI qatlamining vazifasi.
 */
const ICONS = {
  // Kategoriyalar
  siren: Siren,
  utensils: Utensils,
  croissant: Croissant,
  moon: Moon,
  scissors: Scissors,
  trees: Trees,
  mountain: Mountain,
  // Xizmat sharoitlari
  wifi: Wifi,
  parking: SquareParking,
  card: CreditCard,
  cash: Banknote,
  kids: Baby,
  delivery: Bike,
  wheelchair: Accessibility,
  outdoor: Umbrella,
  family: Users,
  // Sovrinlar
  trophy: Trophy,
  medal: Medal,
  "thumbs-up": ThumbsUp,
  "shield-check": ShieldCheck,
  // Interfeys
  search: Search,
  "map-pin": MapPin,
  star: Star,
  clock: Clock,
  phone: Phone,
  globe: Globe,
  "chevron-right": ChevronRight,
  "chevron-left": ChevronLeft,
  "chevron-down": ChevronDown,
  filter: Filter,
  sort: ArrowUpDown,
  close: X,
  check: Check,
  navigation: Navigation,
  list: List,
  map: MapIcon,
  warning: TriangleAlert,
  verified: BadgeCheck,
  menu: Menu,
  languages: Languages,
  user: User,
  home: House,
  bookmark: Bookmark,
  "external-link": ExternalLink,
  info: Info,
  image: ImageIcon,
  alert: CircleAlert,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

export function isIconName(value: string): value is IconName {
  return value in ICONS;
}

export function Icon({
  name,
  className,
  strokeWidth = 1.75,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Component = isIconName(name) ? ICONS[name] : Info;
  return <Component className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
