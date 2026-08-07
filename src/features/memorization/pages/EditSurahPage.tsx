import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import type { MasteryLevel, MemorizationUnit } from "../../../types";
import {
  getMemorizationUnitById,
  updateMemorizationUnit,
} from "../services/memorizationService";

type EditSurahForm = {
  memorizedAt: string;
  masteryLevel: MasteryLevel;
};

function EditSurahPage() {
  const { unitId } = useParams<{ unitId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [surah, setSurah] = useState<MemorizationUnit | null>(null);

  const [formData, setFormData] = useState<EditSurahForm>({
    memorizedAt: "",
    masteryLevel: "good",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !unitId) {
      setError("تعذر تحديد السورة المطلوبة.");
      setIsLoading(false);
      return;
    }

    const loadSurah = async () => {
      try {
        setError("");

        const result = await getMemorizationUnitById(user.uid, unitId);

        if (!result) {
          setError("لم يتم العثور على السورة المطلوبة.");
          return;
        }

        setSurah(result);

        setFormData({
          memorizedAt: result.memorizedAt?.split("T")[0] || "",
          masteryLevel: result.masteryLevel,
        });
      } catch (error) {
        console.error(error);
        setError("حدث خطأ أثناء تحميل بيانات السورة.");
      } finally {
        setIsLoading(false);
      }
    };

    loadSurah();
  }, [user, unitId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user || !unitId) {
      setError("تعذر تحديد المستخدم أو السورة المطلوبة.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      await updateMemorizationUnit(user.uid, unitId, {
        memorizedAt: formData.memorizedAt,
        masteryLevel: formData.masteryLevel,
      });

      navigate("/my-surahs", {
        state: {
          successMessage: "تم حفظ التعديلات بنجاح.",
        },
      });
    } catch (error) {
      console.error(error);
      setError("حدث خطأ أثناء حفظ التعديلات.");
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <main dir="rtl" className="min-h-screen bg-[#F4F7F2] px-5 py-6 text-right">
      <section className="mx-auto max-w-md">
        <div className="rounded-3xl bg-linear-to-br from-emerald-700 to-emerald-500 p-6 text-white shadow-lg">
          <p className="text-sm opacity-90">تحديث بيانات الحفظ 🌿</p>

          <h1 className="mt-3 text-3xl font-bold">تعديل السورة</h1>

          <p className="mt-3 text-sm leading-6 opacity-90">
            عدّلي تاريخ الحفظ أو مستوى الإتقان، ثم احفظي التغييرات.
          </p>
        </div>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
          {isLoading && (
            <p
              role="status"
              aria-live="polite"
              className="text-center text-sm text-gray-500"
            >
              جاري تحميل بيانات السورة...
            </p>
          )}

          {!isLoading && error && !surah && (
            <div>
              <p
                role="alert"
                className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700"
              >
                {error}
              </p>

              <button
                type="button"
                onClick={() => navigate("/my-surahs")}
                className="mt-4 w-full rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
              >
                العودة إلى السور المحفوظة
              </button>
            </div>
          )}

          {!isLoading && surah && (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="rounded-2xl bg-emerald-50 p-4">
                <p className="text-sm text-gray-500">السورة</p>

                <p className="mt-1 text-lg font-bold text-gray-800">
                  سورة {surah.surahName}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  سورة رقم {surah.surahNumber} • الجزء {surah.juzNumber}
                </p>

                <p className="mt-3 text-xs leading-5 text-gray-400">
                  بيانات السورة ثابتة. إذا أُضيفت سورة بالخطأ، احذفيها ثم أضيفي
                  السورة الصحيحة.
                </p>
              </div>

              <div>
                <label
                  htmlFor="memorizedAt"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  تاريخ الحفظ
                </label>

                <input
                  id="memorizedAt"
                  type="date"
                  value={formData.memorizedAt}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      memorizedAt: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
                />
              </div>

              <fieldset>
                <legend className="mb-3 text-sm font-bold text-gray-700">
                  مستوى الإتقان الحالي
                </legend>

                <div className="flex gap-2">
                  {(["weak", "good", "excellent"] as const).map((level) => {
                    const isSelected = formData.masteryLevel === level;

                    return (
                      <button
                        key={level}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            masteryLevel: level,
                          }))
                        }
                        className={`flex-1 rounded-full border px-3 py-3 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${
                          isSelected
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
                    );
                  })}
                </div>
              </fieldset>

              {error && (
                <p
                  role="alert"
                  className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700"
                >
                  {error}
                </p>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving ? "جاري الحفظ..." : "حفظ التعديلات"}
                </button>

                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => navigate("/my-surahs")}
                  className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  إلغاء
                </button>
              </div>
            </form>
          )}
        </section>
      </section>
    </main>
  );
}

export default EditSurahPage;
