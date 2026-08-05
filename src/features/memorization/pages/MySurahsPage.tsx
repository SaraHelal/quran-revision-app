import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import {
  getUserMemorizationUnits,
  deleteMemorizationUnit,
} from "../services/memorizationService";
import type { MemorizationUnit } from "../../../types";
import { logout } from "../../../services/firebase/auth";
import { useNavigate } from "react-router-dom";

function MySurahsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [surahs, setSurahs] = useState<MemorizationUnit[]>([]);
  const [surahToDelete, setSurahToDelete] = useState<MemorizationUnit | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [error, setError] = useState("");
  const userName = user?.displayName || "مستخدمة";
  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };
  const handleLogout = async () => {
    await logout();
  };

  const handleEdit = (unitId: string) => {
    navigate(`/edit-surah/${unitId}`);
  };
  const handleDelete = (unit: MemorizationUnit) => {
    setSurahToDelete(unit);
    setError("");
    setSuccessMessage("");
  };
  const handleConfirmDelete = async () => {
    if (!user || !surahToDelete) return;
    try {
      setIsDeleting(true);
      setError("");
      await deleteMemorizationUnit(user.uid, surahToDelete.id);
      setSurahs((currentSurahs) =>
        currentSurahs.filter((item) => item.id !== surahToDelete.id),
      );
      setSuccessMessage(`تم حذف سورة ${surahToDelete.surahName} بنجاح.`);
      setSurahToDelete(null);
    } catch (error) {
      setError("حدث خطأ أثناء حذف السورة. حاولي مرة أخرى.");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };
  const handleAddSurah = () => {
    navigate("/add-surah");
  };
  const loadSurahs = async (userId: string) => {
    try {
      setError("");
      const result = await getUserMemorizationUnits(userId);
      setSurahs(result);
    } catch (error) {
      console.error(error);
      setError("حدث خطأ أثناء تحميل السور");
    }
  };
  useEffect(() => {
    if (!successMessage) return
    const timer = setTimeout(()=>{
      setSuccessMessage("")
    }, 3000)
    return () => clearTimeout(timer)
  }, [successMessage])
  useEffect(() => {
    if (!user) return;

    loadSurahs(user.uid);
  }, [user]);
  return (
    <main className="min-h-screen bg-[#F4F7F2] px-5 py-6 text-right" dir="rtl">
      <section className="mx-auto max-w-md">
        <div className="rounded-3xl bg-linear-to-br from-emerald-700 to-emerald-500 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm opacity-90">السلام عليكم يا {userName} 🌷</p>
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleBackToDashboard}
                className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white transition hover:bg-white/30"
              >
                → الرئيسية
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white transition hover:bg-white/30"
              >
                خروج
              </button>
            </div>
          </div>
          <h1 className="mt-3 text-3xl font-bold">قائمة السور المحفوظة</h1>
          <p className="mt-3 text-sm leading-6 opacity-90">
            تابعي مراجعتك اليومية وحافظي على ما تم حفظه من القرآن الكريم.
          </p>
        </div>
        {successMessage && (
          <p className="mb-4 mt-4 rounded-xl bg-green-100 p-3 text-center text-sm font-medium text-green-700">
            {successMessage}
          </p>
        )}
        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800">قائمة السور</h2>
              <span className="mt-2 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                {surahs.length === 0
                  ? "لا توجد سور"
                  : `${surahs.length} سور محفوظة`}
              </span>
            </div>
            <button
              onClick={handleAddSurah}
              className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
            >
              + إضافة سورة
            </button>
          </div>
          {error && (
            <span className="mt-5 block rounded-2xl bg-red-50 p-4 text-center text-sm font-bold text-red-600">
              {error}
            </span>
          )}

          <div className="mt-5">
            {surahs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 p-6 text-center">
                <p className="text-4xl">📖</p>

                <h3 className="mt-3 font-bold text-gray-800">
                  لا توجد سور بعد
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  أضيفي أول سورة محفوظة ليبدأ التطبيق في تنظيم ورد المراجعة
                  اليومي.
                </p>

                <button
                  onClick={handleAddSurah}
                  className="mt-5 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
                >
                  + إضافة سورة
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {surahs.map((surah) => (
                  <div
                    key={surah.id}
                    className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-gray-800">
                          {surah.surahName}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                          الجزء {surah.juzNumber} • سورة رقم {surah.surahNumber}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          surah.masteryLevel === "weak"
                            ? "bg-red-100 text-red-700"
                            : surah.masteryLevel === "good"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {surah.masteryLevel === "weak"
                          ? "ضعيف"
                          : surah.masteryLevel === "good"
                            ? "جيد"
                            : "ممتاز"}
                      </span>
                    </div>
                    <div className="mt-4">
                      <hr className="mb-4 border-gray-200" />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(surah.id)}
                          className="flex-1 rounded-full border border-gray-200 bg-white py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50"
                        >
                          تعديل
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(surah)}
                          className="flex-1 rounded-full border border-gray-200 bg-white py-3 text-sm font-medium text-gray-700 shadow-sm transition   hover:border-red-200 hover:bg-red-50"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </section>

      {surahToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow p-4">
            <p> هل أنتِ متأكدة من حذف سورة {surahToDelete.surahName}؟</p>
            <p className="mt-2 text-sm text-gray-500 text-center">
              لن تتمكني من استعادة السورة بعد حذفها.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                className="flex-1 rounded-2xl bg-red-500 py-3 font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "جارٍ حذف السورة..." : "حذف السورة"}
              </button>

              <button
                type="button"
                className="flex-1 rounded-2xl bg-gray-100 py-3 font-bold text-gray-700 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => setSurahToDelete(null)}
                disabled={isDeleting}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default MySurahsPage;
