import {
  Backpack,
  Bike,
  BookOpen,
  Briefcase,
  GraduationCap,
  Headphones,
  Keyboard,
  LampDesk,
  Laptop,
  Package,
  Shirt,
  Smartphone,
} from 'lucide-react';

const ICON_MAP = {
  GraduationCap,
  BookOpen,
  Laptop,
  Smartphone,
  Keyboard,
  Headphones,
  Bike,
  LampDesk,
  Backpack,
  Shirt,
  Briefcase,
  Package,
} as const;

export function CategoryIcon({ name, className = 'h-5 w-5' }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name as keyof typeof ICON_MAP] ?? Package;
  return <Icon className={className} aria-hidden="true" />;
}
