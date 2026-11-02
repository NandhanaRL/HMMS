import { useEffect, useState } from "react";
import { Utensils, Calendar, Clock, Sparkles, ChefHat } from "lucide-react";
import StudentLayout from "../../layouts/StudentLayout";
import api from "../../services/api";
import PageContainer from "../../components/ui/PageContainer";
import SectionHeader from "../../components/ui/SectionHeader";
import Badge from "../../components/ui/Badge";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

export default function Mess() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackMeals = [
    {
      meal_type: "Breakfast",
      name: "Idli, Medu Vada, Madras Sambar, Coconut Chutney & Filter Coffee",
      time: "07:30 AM — 09:00 AM",
      category: "South Indian Special",
    },
    {
      meal_type: "Lunch",
      name: "Steamed Ponni Rice, Paneer Butter Masala, Yellow Dal Tadka, Seasonal Poriyal & Curd",
      time: "12:30 PM — 02:30 PM",
      category: "Full Thali Meal",
    },
    {
      meal_type: "Snacks",
      name: "Crispy Veg Cutlet & Samosa served with Ginger Masala Chai or Coffee",
      time: "04:30 PM — 05:45 PM",
      category: "Evening High Tea",
    },
    {
      meal_type: "Dinner",
      name: "Butter Phulka Roti, Mix Veg Kolhapuri, Jeera Rice, Rasam & Gulab Jamun",
      time: "07:30 PM — 09:30 PM",
      category: "Comfort Dinner",
    },
  ];

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data } = await api.get("/mess/menu");
        if (data.menu && data.menu.length > 0) {
          setMenu(data.menu);
        } else {
          setMenu([]);
        }
      } catch (err) {
        console.error("Error fetching mess menu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const displayMeals =
    menu.length > 0
      ? menu.map((m) => {
          const matchedFallback = fallbackMeals.find(
            (f) => f.meal_type.toLowerCase() === m.meal_type.toLowerCase()
          );
          return {
            meal_type: m.meal_type,
            name: m.name,
            time: matchedFallback ? matchedFallback.time : "Standard Mess Hours",
            category: matchedFallback ? matchedFallback.category : "Daily Catering",
          };
        })
      : fallbackMeals;

  return (
    <StudentLayout>
      <PageContainer>
        <SectionHeader
          title="Mess & Dining Timetable"
          description="Daily freshly prepared four-course student dining schedule and meal timings."
          badge={
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Sparkles size={12} />
              <span>Campus Catering Schedule</span>
            </div>
          }
          action={
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#0F172A] border border-white/10 text-slate-300 text-xs font-medium">
              <Calendar size={14} className="text-[#2563EB]" />
              <span>{today}</span>
            </div>
          }
        />

        {loading ? (
          <LoadingSpinner label="Loading culinary schedule..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayMeals.map((item, index) => {
              const badgeColors = ["primary", "purple", "cyan", "success"];
              const currentBadge = badgeColors[index % badgeColors.length];

              return (
                <div
                  key={item.meal_type}
                  className="group relative overflow-hidden bg-[#111827] border border-white/10 rounded-3xl p-6 shadow-card hover:shadow-card-hover transition-smooth hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between pb-4 border-b border-white/10 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#2563EB]/15 text-[#2563EB] border border-[#2563EB]/25 shrink-0">
                        <Utensils size={18} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#F8FAFC] tracking-tight">
                          {item.meal_type}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {item.category}
                        </p>
                      </div>
                    </div>

                    <Badge variant={currentBadge} size="sm">
                      Active
                    </Badge>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#1A2338]/60 border border-white/5 min-h-[85px] flex items-center mb-4">
                    <p className="text-sm font-medium text-slate-100 leading-relaxed">
                      {item.name}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
                    <div className="flex items-center gap-1.5 text-[#2563EB] font-medium">
                      <Clock size={14} />
                      <span>{item.time}</span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-400">
                      <ChefHat size={14} className="text-[#16A34A]" />
                      <span>Unlimited Servings</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Mess Guidelines info box */}
        <div className="p-6 rounded-3xl bg-[#1A2338]/60 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-semibold text-[#F8FAFC]">
              Special Dietary or Sick Diet Request?
            </h4>
            <p className="text-xs text-slate-400">
              Students unwell can request bland porridge/khichdi directly from the Mess Manager office.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success">FSSAI Certified</Badge>
            <Badge variant="primary">100% Hygienic</Badge>
          </div>
        </div>
      </PageContainer>
    </StudentLayout>
  );
}
