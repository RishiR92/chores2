import {
  Wrench, UtensilsCrossed, Gift, Scissors, Stethoscope, Plane, Car,
  Bell, ShoppingBag, Mail, FileText, CalendarDays, MapPin, ListChecks,
  MessageCircle, Sparkles, Pill, CreditCard, HardHat, Dog,
  type LucideIcon,
} from "lucide-react";

type Tone = "violet" | "magenta" | "indigo" | "sky" | "peach" | "mint" | "slate";

const MAP: Record<string, { Icon: LucideIcon; tone: Tone; label: string }> = {
  "marco-hvac":    { Icon: Wrench,          tone: "violet",  label: "repair" },
  "dinner-sf":     { Icon: UtensilsCrossed, tone: "peach",   label: "dining" },
  "plumber-sat":   { Icon: Wrench,          tone: "indigo",  label: "plumber" },
  "rx-refill":     { Icon: Pill,            tone: "mint",    label: "pharmacy" },
  "dad-checkin":   { Icon: MessageCircle,   tone: "peach",   label: "message" },
  "insurance":     { Icon: FileText,        tone: "indigo",  label: "claim" },
  "gift-mom":      { Icon: Gift,            tone: "magenta", label: "gift" },
  "gym-cancel":    { Icon: Mail,            tone: "slate",   label: "cancel" },
  "dentist":       { Icon: Stethoscope,     tone: "sky",     label: "dentist" },
  "cable-bill":    { Icon: CreditCard,      tone: "mint",    label: "bill" },
  "dog-walker":    { Icon: Dog,             tone: "peach",   label: "pet" },
  "amazon-return": { Icon: ShoppingBag,     tone: "violet",  label: "return" },
  "contractors":   { Icon: HardHat,         tone: "indigo",  label: "quotes" },
  "tahoe":         { Icon: Plane,           tone: "sky",     label: "trip" },
  "haircut":       { Icon: Scissors,        tone: "magenta", label: "haircut" },
};

const FALLBACKS: { test: RegExp; Icon: LucideIcon; tone: Tone; label: string }[] = [
  { test: /restaurant|dinner|lunch|ramen|food|eat/i,  Icon: UtensilsCrossed, tone: "peach",   label: "dining" },
  { test: /plumb|leak|drain|hvac|repair|fix/i,        Icon: Wrench,          tone: "indigo",  label: "repair" },
  { test: /gift|birthday|present/i,                   Icon: Gift,            tone: "magenta", label: "gift" },
  { test: /haircut|barber|salon/i,                    Icon: Scissors,        tone: "magenta", label: "barber" },
  { test: /dentist|doctor|clinic|appointment/i,       Icon: Stethoscope,     tone: "sky",     label: "health" },
  { test: /flight|travel|trip|tahoe|hotel/i,          Icon: Plane,           tone: "sky",     label: "travel" },
  { test: /ride|uber|lyft|taxi/i,                     Icon: Car,             tone: "indigo",  label: "ride" },
  { test: /remind|schedule/i,                         Icon: Bell,            tone: "violet",  label: "reminder" },
  { test: /shop|order|return|amazon/i,                Icon: ShoppingBag,     tone: "violet",  label: "shopping" },
  { test: /email|mail/i,                              Icon: Mail,            tone: "slate",   label: "email" },
  { test: /quote|estimate|contractor/i,               Icon: FileText,        tone: "indigo",  label: "quotes" },
  { test: /calendar|book|reservation/i,               Icon: CalendarDays,    tone: "mint",    label: "booking" },
  { test: /map|near|find|directions/i,                Icon: MapPin,          tone: "peach",   label: "places" },
  { test: /list|checklist|todo/i,                     Icon: ListChecks,      tone: "mint",    label: "list" },
  { test: /message|text|whatsapp|sms/i,               Icon: MessageCircle,   tone: "peach",   label: "message" },
];

export function categoryFor(canvas: { id: string; title: string }) {
  if (MAP[canvas.id]) return MAP[canvas.id];
  for (const f of FALLBACKS) if (f.test.test(canvas.title)) return { Icon: f.Icon, tone: f.tone, label: f.label };
  return { Icon: Sparkles, tone: "violet" as Tone, label: "task" };
}
