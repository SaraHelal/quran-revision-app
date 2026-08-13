import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { logout } from "../../../services/firebase/auth";
import { MASTERY_SCORES } from "../../../constants/mastery";
import type { MemorizationUnit } from "../../../types";
import { getUserMemorizationUnits } from "../../memorization/services/memorizationService";
import ActiveReviewCard from "../components/ActiveReviewCard";
import ReviewConflictModal from "../components/ReviewConflictModal";
import { isReviewDue } from "../../reviews/utils/reviewSchedule";

function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Stores the user's memorized surahs loaded from Firestore.
  const [surahs, setSurahs] = useState<MemorizationUnit[]>([]);

  // Stores an error message when dashboard data cannot be loaded.
  const [error, setError] = useState("");

  // Stores the ID of the review session that is currently in progress.
  const [activeReviewUnitId, setActiveReviewUnitId] = useState<string | null>(
    null,
  );

  // Stores the ID of the review the user attempted to start
  // while a different review session is already active.
  const [pendingReviewUnitId, setPendingReviewUnitId] = useState<string | null>(
    null,
  );

  const userName = user?.displayName || "مستخدمة";

  const prioritySurahs = [...surahs]
    .filter((surah) => isReviewDue(surah.nextReviewDate))
    .sort(
      (a, b) => MASTERY_SCORES[a.masteryLevel] - MASTERY_SCORES[b.masteryLevel],
    )
    .slice(0, 3);

  // Counts the surahs currently marked as weak.
  const weakSurahsCount = surahs.filter(
    (surah) => surah.masteryLevel === "weak",
  ).length;

  // Finds the full surah data for the unfinished review session.
  const activeReviewSurah = surahs.find(
    (surah) => surah.id === activeReviewUnitId,
  );

  // Restores an unfinished review from localStorage
  // and loads the user's memorized surahs.
  useEffect(() => {
    if (!user) return;

    const storedReviewUnitId = localStorage.getItem("activeReviewUnitId");
    setActiveReviewUnitId(storedReviewUnitId);

    const loadSurahs = async () => {
      try {
        setError("");

        const result = await getUserMemorizationUnits(user.uid);
        setSurahs(result);
      } catch (loadError) {
        console.error(loadError);
        setError("حدث خطأ أثناء تحميل السور. حاولي مرة أخرى.");
      }
    };

    loadSurahs();
  }, [user]);

  // Opens the selected review directly when no different review is active.
  // Otherwise, stores it as pending and opens the conflict modal.
  const handleStartReview = (unitId: string) => {
    if (!activeReviewUnitId || activeReviewUnitId === unitId) {
      navigate(`/review/${unitId}`);
      return;
    }

    setPendingReviewUnitId(unitId);
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleMySurahs = () => {
    navigate("/my-surahs");
  };

  const handleAddSurah = () => {
    navigate("/add-surah");
  };

  // Cancels the current review session without saving a review result.
  const handleCancelActiveReview = () => {
    localStorage.removeItem("activeReviewUnitId");
    setActiveReviewUnitId(null);
  };

  // Closes the conflict modal and resumes the existing review session.
  const handleContinueActiveReview = () => {
    if (!activeReviewUnitId) return;

    setPendingReviewUnitId(null);
    navigate(`/review/${activeReviewUnitId}`);
  };

  // Replaces the existing unfinished review with the newly selected review.
  const handleStartNewReview = () => {
    if (!pendingReviewUnitId) return;

    const newReviewUnitId = pendingReviewUnitId;

    localStorage.setItem("activeReviewUnitId", newReviewUnitId);
    setActiveReviewUnitId(newReviewUnitId);
    setPendingReviewUnitId(null);

    navigate(`/review/${newReviewUnitId}`);
  };

  // Closes the review conflict modal without changing the active review.
  const handleCloseReviewConflict = () => {
    setPendingReviewUnitId(null);
  };

  return (
    <main className="min-h-screen bg-[#F4F7F2] px-5 py-6 text-right" dir="rtl">
      <section className="mx-auto max-w-md">
        <div className="rounded-3xl bg-linear-to-br from-emerald-700 to-emerald-500 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm opacity-90">السلام عليكم يا {userName} 🌷</p>

            <button
              type="button"
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

        {error && (
          <div
            role="alert"
            className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700"
          >
            {error}
          </div>
        )}

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-emerald-700">
              {prioritySurahs.length}
            </p>

            <p className="mt-1 text-xs text-gray-500">ورد اليوم</p>
          </div>

          <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-amber-600">
              {weakSurahsCount}
            </p>

            <p className="mt-1 text-xs text-gray-500">متأخر</p>
          </div>

          <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-sky-600">{surahs.length}</p>

            <p className="mt-1 text-xs text-gray-500">محفوظ</p>
          </div>
        </div>

        {activeReviewUnitId && (
          <ActiveReviewCard
            surahName={activeReviewSurah?.surahName}
            onContinue={handleContinueActiveReview}
            onCancel={handleCancelActiveReview}
          />
        )}

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800">مراجعة اليوم</h2>

              <span className="mt-2 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                {prioritySurahs.length === 0
                  ? "لا يوجد ورد"
                  : `${prioritySurahs.length} سور للمراجعة`}
              </span>
            </div>

            <button
              type="button"
              onClick={handleAddSurah}
              className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
            >
              + إضافة سورة
            </button>
          </div>

          <div className="mt-5">
            {prioritySurahs.length === 0 ? (
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
                  type="button"
                  onClick={handleAddSurah}
                  className="mt-5 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
                >
                  + إضافة سورة
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {prioritySurahs.map((surah) => (
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

                    <div className="mt-5 flex justify-start">
                      <button
                        type="button"
                        onClick={() => handleStartReview(surah.id)}
                        className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-5 py-2.5 text-sm font-bold text-emerald-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50"
                      >
                        <span>ابدئي المراجعة</span>
                        <span aria-hidden="true">←</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
              📚
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-800">
                إدارة السور المحفوظة
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                عرض جميع السور المحفوظة وإدارتها.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleMySurahs}
            className="mt-5 w-full rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
          >
            عرض السور المحفوظة
          </button>
        </section>
      </section>

      {pendingReviewUnitId && (
        <ReviewConflictModal
          activeSurahName={activeReviewSurah?.surahName}
          onContinueReview={handleContinueActiveReview}
          onStartNewReview={handleStartNewReview}
          onClose={handleCloseReviewConflict}
        />
      )}
    </main>
  );
}

export default DashboardPage;
