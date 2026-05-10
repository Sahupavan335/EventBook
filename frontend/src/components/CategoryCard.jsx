import { Link } from "react-router-dom";
import { Camera, Music, Palette, Utensils, Sparkles, ClipboardList } from "lucide-react";

const CATEGORY_CONFIG = {
  photography: { icon: Camera, label: "Photography", color: "bg-blue-50 text-blue-700" },
  dj: { icon: Music, label: "DJ & Music", color: "bg-purple-50 text-purple-700" },
  decoration: { icon: Palette, label: "Decoration", color: "bg-rose-50 text-rose-700" },
  catering: { icon: Utensils, label: "Catering", color: "bg-amber-50 text-amber-700" },
  makeup: { icon: Sparkles, label: "Makeup", color: "bg-pink-50 text-pink-700" },
  planning: { icon: ClipboardList, label: "Event Planning", color: "bg-emerald-50 text-emerald-700" },
};

export const CategoryCard = ({ categoryKey }) => {
  const config = CATEGORY_CONFIG[categoryKey];
  if (!config) return null;
  const Icon = config.icon;

  return (
    <Link
      to={`/services?category=${categoryKey}`}
      className="group flex flex-col items-center gap-3 p-6 bg-white border border-slate-200/60 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300"
    >
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${config.color} group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="h-6 w-6" />
      </div>
      <span className="font-outfit font-semibold text-sm text-slate-800">{config.label}</span>
    </Link>
  );
}

