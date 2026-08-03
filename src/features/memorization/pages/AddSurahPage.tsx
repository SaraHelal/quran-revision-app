import { useState } from "react";
import type { MasteryLevel } from "../../../types";
import { useAuth } from "../../../hooks/useAuth";
import { addMemorizationUnit } from "../services/memorizationService";
import { useNavigate } from "react-router-dom";
import { QURAN_SURAHS } from "../../../constants/quranSurahs";
const getTodayDateInputValue = () => {
  return new Date().toISOString().split("T")[0];
};
function AddSurahPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [surahName, setSurahName] = useState("");
  const [surahNumber, setSurahNumber] = useState("");
  const [juzNumber, setJuzNumber] = useState("");
  const [memorizedAt, setMemorizedAt] = useState(getTodayDateInputValue());
  const [masteryLevel, setMasteryLevel] = useState<MasteryLevel>("good");

  const [error, setError] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const handleAddAnother = () => {
    setSurahName("");
    setSurahNumber("");
    setJuzNumber("");
    setMemorizedAt(getTodayDateInputValue());
    setMasteryLevel("good");
    setError("");
    setIsSaved(false);
  };

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!surahName.trim()) return setError("يجب أن تدخل اسم السورة");

    if (!user) {
      setError("يجب تسجيل الدخول أولًا.");
      return;
    }
    const data = {
      surahName: surahName.trim(),
      surahNumber: Number(surahNumber),
      juzNumber: Number(juzNumber),
      memorizedAt: memorizedAt || new Date().toISOString(),
      masteryLevel,
    };
    setError("");

    try {
      setIsSaving(true);
      await addMemorizationUnit(user.uid, data);
      setIsSaved(true);
    } catch (error) {
      console.error(error);
      setError("حدث خطأ أثناء حفظ السورة");
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <main dir="rtl" className="min-h-screen bg-[#F4F7F2] px-5 py-6 text-right">
      <section className="mx-auto max-w-md">
        <div className="rounded-3xl bg-linear-to-br from-emerald-700 to-emerald-500 p-6 text-white shadow-lg">
          <p className="text-sm opacity-90">خطوة جديدة في رحلة الحفظ 🌿</p>
          <div className="mb-5 flex items-center gap-3">
            <h1 className="text-3xl font-bold">إضافة سورة</h1>
          </div>{" "}
          <p className="mt-3 text-sm leading-6 opacity-90">
            أضيفي السورة التي حفظتِها حتى يبدأ التطبيق في تنظيم مراجعتها.
          </p>
        </div>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
          {error && (
            <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              {error}
            </div>
          )}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="relative">
              <select
                value={surahNumber}
                onChange={(e) => {
                  const selectedSurah = QURAN_SURAHS.find(
                    (surah) => surah.number === Number(e.target.value),
                  );

                  if (!selectedSurah) return;

                  setSurahName(selectedSurah.name);
                  setSurahNumber(String(selectedSurah.number));
                  setJuzNumber(String(selectedSurah.juzNumber));
                }}
                className="w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 pl-10 text-sm outline-none focus:border-emerald-500"
              >
                <option value="">اختاري السورة</option>

                {QURAN_SURAHS.map((surah) => (
                  <option key={surah.number} value={surah.number}>
                    سورة {surah.name}
                  </option>
                ))}
              </select>

              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                ▼
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  رقم السورة
                </label>
                <input
                  type="number"
                  value={surahNumber}
                  readOnly
                  className="w-full rounded-2xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  رقم الجزء
                </label>
                <input
                  type="number"
                  value={juzNumber}
                  readOnly
                  className="w-full rounded-2xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                تاريخ الحفظ
              </label>
              <input
                type="date"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                value={memorizedAt}
                onChange={(e) => setMemorizedAt(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-3 block text-sm font-bold text-gray-700">
                مستوى الإتقان الحالي
              </label>

              <div className="flex gap-2">
                {(["weak", "good", "excellent"] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setMasteryLevel(level)}
                    className={`flex-1 rounded-full border px-4 py-3 text-sm font-medium transition ${
                      masteryLevel === level
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {level === "weak"
                      ? "ضعيف"
                      : level === "good"
                        ? "جيد"
                        : "ممتاز"}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
               <button
                type="submit"
                disabled={isSaving}
                className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {isSaving ? "جاري الحفظ..." : "حفظ السورة"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
              >
                العودة
              </button>

             
            </div>{" "}
          </form>
          {isSaved && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-5">
              <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-xl">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl">
                  🌿
                </div>

                <h2 className="mt-4 text-xl font-bold text-gray-800">
                  تم حفظ السورة بنجاح
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  هل ترغبين في إضافة سورة أخرى أم الرجوع للوحة الرئيسية؟
                </p>

                <div className="mt-6 space-y-3">
                  <button
                    type="button"
                    className="w-full rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
                    onClick={handleAddAnother}
                  >
                    نعم، إضافة سورة أخرى
                  </button>

                  <button
                    type="button"
                    className="w-full rounded-2xl bg-gray-100 px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-200"
                    onClick={() => navigate("/")}
                  >
                    الرجوع للوحة الرئيسية
                  </button>
                </div>
              </div>
            </div>
          )}{" "}
        </section>
      </section>
    </main>
  );
}

export default AddSurahPage;
