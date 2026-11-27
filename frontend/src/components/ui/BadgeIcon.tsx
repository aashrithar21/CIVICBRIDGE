import { Flag, ShieldCheck, Camera, Layers, Megaphone, Heart, CheckCircle2, Star, Award } from 'lucide-react'

const icons = {
  flag: Flag,
  shield: ShieldCheck,
  camera: Camera,
  layers: Layers,
  megaphone: Megaphone,
  heart: Heart,
  check: CheckCircle2,
  star: Star,
} as const

export default function BadgeIcon({ name, size = 24 }: { name: string; size?: number }) {
  const Icon = icons[name as keyof typeof icons] ?? Award
  return <Icon size={size} aria-hidden="true" />
}
