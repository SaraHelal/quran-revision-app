import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { logout } from "../../../services/firebase/auth";
import { useEffect, useState } from "react";
import { getUserMemorizationUnits } from "../../memorization/services/memorizationService";
import type { MemorizationUnit } from "../../../types";

function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [surahs, setSurahs] = useState<MemorizationUnit[]>([]);
  const todayReviewItems = surahs.slice(0, 3);
  const [error, setError] = useState("");
  const userName = user?.displayName || "مستخدمة";

  const masteryPriority = {
  weak: 1,
  good: 2,
  excellent: 3,
};
const prioritySurahs = [...surahs].sort((a,b)=> masteryPriority[a.masteryLevel]-masteryPriority[b.masteryLevel]).slice(0,3)
  const handleLogout = async () => {
    await logout();
  };
  const handleAddSurah = () => {
    navigate("/add-surah");
  };
  useEffect(() => {
    if (!user) return;

    const userId = user.uid;

    async function getSurahs() {
      try {
        const result = await getUserMemorizationUnits(userId);
        setSurahs(result);
      } catch (error) {
        console.error(error);
        setError("حدث خطأ أثناء تحميل السور");
      }
    }

    getSurahs();
  }, [user]);
  return (
    <main className="min-h-screen bg-[#F4F7F2] px-5 py-6 text-right" dir="rtl">
      <section className="mx-auto max-w-md">
        <div className="rounded-3xl bg-linear-to-br from-emerald-700 to-emerald-500 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm opacity-90">السلام عليكم يا {userName} 🌷</p>

            <button
              onClick={handleLogout}
              className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white transition hover:bg-white/30"
            >
              خروج
            </button>
          </div>
          <h1 className="mt-3 text-3xl font-bold">ورد المراجعة اليوم</h1>
          <p className="mt-3 text-sm leading-6 opacity-90">
            تابعي مراجعتك اليومية وحافظي على ما تم حفظه من القرآن الكريم.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-emerald-700">0</p>
            <p className="mt-1 text-xs text-gray-500">ورد اليوم</p>
          </div>

          <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-amber-600">0</p>
            <p className="mt-1 text-xs text-gray-500">متأخر</p>
          </div>

          <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-sky-600">{surahs.length}</p>
            <p className="mt-1 text-xs text-gray-500">محفوظ</p>
          </div>
        </div>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">مراجعة اليوم</h2>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
              لا يوجد ورد
            </span>
          </div>

          <div className="mt-5 rounded-2xl border border-dashed border-gray-300 p-6 text-center">
            {prioritySurahs.length === 0 ? (
              <>
                <p className="text-4xl">📖</p>
                <h3 className="mt-3 font-bold text-gray-800">
                  لا توجد سور بعد
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  أضيفي أول سورة محفوظة ليبدأ التطبيق في تنظيم ورد المراجعة
                  اليومي.
                </p>
              </>
            ) : 
            <div>
              {prioritySurahs.map(item=>(
                  <p key={item.id}>{item.surahName}</p>

              ))}
            </div>
            }

            <button
              onClick={handleAddSurah}
              className="mt-5 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
            >
              + إضافة سورة
            </button>
          </div>
        </section>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800">السور المحفوظة</h2>

          <p className="mt-3 text-sm text-gray-500">
            ستظهر هنا السور التي قمتِ بإضافتها للمراجعة.
          </p>
        </section>
      </section>
    </main>
  );
}

export default DashboardPage;
