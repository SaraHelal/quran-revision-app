import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import type { MasteryLevel, MemorizationUnit } from "../../../types";
import { logout } from "../../../services/firebase/auth";
import {
  completeMemorizationUnitReview,
  getMemorizationUnitById,
} from "../../memorization/services/memorizationService";

const ACTIVE_REVIEW_STORAGE_KEY = "activeReviewUnitId";

function ReviewSessionPage() {
  const { unitId } = useParams<{ unitId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [surah, setSurah] = useState<MemorizationUnit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRatingVisible, setIsRatingVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const userName = user?.displayName || "مستخدمة";

  useEffect(() => {
    async function loadSurah() {
      if (!unitId) {
        setError("تعذر تحديد السورة المطلوبة.");
        setIsLoading(false);
        return;
      }

      if (!user) return;

      try {
        setError("");
        setIsLoading(true);

        const memorizationUnit = await getMemorizationUnitById(
          user.uid,
          unitId,
        );

        if (!memorizationUnit) {
          setError("لم يتم العثور على السورة.");
          return;
        }

        setSurah(memorizationUnit);
        localStorage.setItem(ACTIVE_REVIEW_STORAGE_KEY, unitId);
      } catch (loadError) {
        console.error(loadError);
        setError("حدث خطأ أثناء تحميل السورة.");
      } finally {
        setIsLoading(false);
      }
    }

    loadSurah();
  }, [user, unitId]);

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const handleLogout = async () => {
    await logout();
  };

  async function handleCompleteReview(masteryLevel: MasteryLevel) {
    if (!user || !unitId) {
      setError("تعذر حفظ نتيجة المراجعة.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      await completeMemorizationUnitReview(
        user.uid,
        unitId,
        masteryLevel,
      );

      localStorage.removeItem(ACTIVE_REVIEW_STORAGE_KEY);

      setSurah((currentSurah) =>
        currentSurah
          ? {
              ...currentSurah,
              masteryLevel,
            }
          : currentSurah,
      );

      setIsRatingVisible(false);
      setSuccessMessage("تم حفظ نتيجة المراجعة بنجاح.");
    } catch (saveError) {
      console.error(saveError);
      setError("حدث خطأ أثناء حفظ نتيجة المراجعة.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main
      className="min-h-screen bg-[#F4F7F2] px-5 py-6 text-right"
      dir="rtl"
    >
      <section className="mx-auto max-w-md">
        <div className="rounded-3xl bg-linear-to-br from-emerald-700 to-emerald-500 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm opacity-90">
              السلام عليكم يا {userName} 🌷
            </p>

            <div className="flex items-center gap-3">
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

          <h1 className="mt-3 text-3xl font-bold">جلسة المراجعة</h1>

          <p className="mt-3 text-sm leading-6 opacity-90">
            راجعي السورة من حفظك، ثم سجّلي مستوى المراجعة.
          </p>
        </div>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
          {isLoading && (
            <p
              role="status"
              aria-live="polite"
              className="py-8 text-center text-sm text-gray-500"
            >
              جارٍ تحميل جلسة المراجعة...
            </p>
          )}

          {!isLoading && (error || !surah) && (
            <div className="text-center">
              <p
                role="alert"
                className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700"
              >
                {error || "لم يتم العثور على السورة."}
              </p>

              <button
                type="button"
                onClick={handleBackToDashboard}
                className="mt-5 rounded-2xl bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-700"
              >
                العودة إلى الصفحة الرئيسية
              </button>
            </div>
          )}

          {!isLoading && surah && (
            <>
              <div className="text-center">
                <p className="mb-2 text-sm font-bold text-emerald-700">
                  جلسة المراجعة
                </p>

                <h2 className="mb-2 text-3xl font-bold text-gray-900">
                  سورة {surah.surahName}
                </h2>

                <p className="text-gray-600">
                  الجزء {surah.juzNumber}
                </p>
              </div>

              <div className="my-6 rounded-2xl bg-emerald-50 p-5 text-center">
                <p className="font-bold text-emerald-900">
                  راجعي السورة الآن من حفظك
                </p>

                <p className="mt-2 text-sm leading-7 text-emerald-800">
                  يمكنكِ استخدام المصحف أو تطبيق التلاوة للتأكد من
                  المواضع التي تحتاج إلى مراجعة.
                </p>
              </div>

              {error && (
                <p
                  role="alert"
                  className="mb-4 rounded-2xl bg-red-50 p-4 text-center text-red-700"
                >
                  {error}
                </p>
              )}

              {successMessage && (
                <div
                  role="status"
                  aria-live="polite"
                  className="rounded-2xl bg-emerald-50 p-5 text-center"
                >
                  <p className="font-bold text-emerald-800">
                    {successMessage}
                  </p>

                  <button
                    type="button"
                    onClick={handleBackToDashboard}
                    className="mt-4 w-full rounded-2xl bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-700"
                  >
                    العودة إلى الصفحة الرئيسية
                  </button>
                </div>
              )}

              {!successMessage && !isRatingVisible && (
                <button
                  type="button"
                  onClick={() => setIsRatingVisible(true)}
                  className="w-full rounded-2xl bg-emerald-600 py-3 font-bold text-white shadow-sm transition hover:bg-emerald-700"
                >
                  أنهيت المراجعة
                </button>
              )}

              {!successMessage && isRatingVisible && (
                <div>
                  <h2 className="mb-4 text-center text-lg font-bold text-gray-900">
                    كيف كان مستوى مراجعتك؟
                  </h2>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleCompleteReview("weak")}
                      disabled={isSaving}
                      className="rounded-2xl bg-red-100 py-3 font-bold text-red-700 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      ضعيف
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCompleteReview("good")}
                      disabled={isSaving}
                      className="rounded-2xl bg-amber-100 py-3 font-bold text-amber-700 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      جيد
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleCompleteReview("excellent")
                      }
                      disabled={isSaving}
                      className="rounded-2xl bg-emerald-100 py-3 font-bold text-emerald-700 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      ممتاز
                    </button>
                  </div>

                  {isSaving && (
                    <p
                      role="status"
                      aria-live="polite"
                      className="mt-4 text-center text-sm text-gray-600"
                    >
                      جارٍ حفظ نتيجة المراجعة...
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </section>
      </section>
    </main>
  );
}

export default ReviewSessionPage;