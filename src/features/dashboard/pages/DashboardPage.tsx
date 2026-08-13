import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { logout } from "../../../services/firebase/auth";
import { MASTERY_SCORES } from "../../../constants/mastery";
import type { MemorizationUnit, ReviewStatus } from "../../../types";
import { getUserMemorizationUnits } from "../../memorization/services/memorizationService";
import ActiveReviewCard from "../components/ActiveReviewCard";
import ReviewConflictModal from "../components/ReviewConflictModal";
import {
  getReviewDateStatus,
  isReviewDue,
} from "../../reviews/utils/reviewSchedule";
import { useEffect, useState } from "react";

function getDateTimestamp(date: string | null | undefined): number {
  if (!date) {
    return Number.NEGATIVE_INFINITY;
  }

  const timestamp = new Date(date).getTime();

  return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp;
}
const REVIEW_STATUS_LABELS: Record<ReviewStatus, string> = {
  overdue: "متأخرة",
  dueToday: "مستحقة اليوم",
  upcoming: "قادمة",
  notScheduled: "مراجعة أولى",
};
const REVIEW_STATUS_STYLES: Record<ReviewStatus, string> = {
  overdue: "bg-red-100 text-red-700",
  dueToday: "bg-green-100 text-green-700",
  upcoming: "bg-blue-100 text-blue-700",
  notScheduled: "bg-gray-100 text-gray-700",
};
function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Stores the user's memorized surahs loaded from Firestore.
  const [surahs, setSurahs] = useState<MemorizationUnit[]>([]);

  // Stores an error message when dashboard data cannot be loaded.
  const [error, setError] = useState("");

  // Tracks the initial Firestore request and prevents premature empty states.
  const [isLoading, setIsLoading] = useState(true);

  // Stores the ID of the review session that is currently in progress.
  const [activeReviewUnitId, setActiveReviewUnitId] = useState<string | null>(
    null,
  );

  // Stores the ID of the review the user attempted to start
  // while a different review session is already active.
  const [pendingReviewUnitId, setPendingReviewUnitId] = useState<string | null>(
    null,
  );
  const [reviewMode, setReviewMode] = useState<"suggested" | "manual">(
    "suggested",
  );
  const [visibleDueCount, setVisibleDueCount] = useState(3);
  const [visibleManualCount, setVisibleManualCount] = useState(5);
  const [surahSearch, setSurahSearch] = useState("");
  const [selectedJuz, setSelectedJuz] = useState<"all" | number>("all");
  const [manualSort, setManualSort] = useState<"newest" | "weakest">("newest");
  const userName = user?.displayName || "مستخدمة";

  // Orders every due surah by due date, mastery, last review, then surah number.
  const dueSurahs = [...surahs]
    .filter((surah) => isReviewDue(surah.nextReviewDate))
    .sort((a, b) => {
      const nextReviewDifference =
        getDateTimestamp(a.nextReviewDate) - getDateTimestamp(b.nextReviewDate);

      if (nextReviewDifference !== 0) {
        return nextReviewDifference;
      }

      const masteryDifference =
        MASTERY_SCORES[a.masteryLevel] - MASTERY_SCORES[b.masteryLevel];

      if (masteryDifference !== 0) {
        return masteryDifference;
      }

      const lastReviewDifference =
        getDateTimestamp(a.lastReviewDate) - getDateTimestamp(b.lastReviewDate);

      if (lastReviewDifference !== 0) {
        return lastReviewDifference;
      }

      return a.surahNumber - b.surahNumber;
    });
  const visibleDueSurahs = dueSurahs.slice(0, visibleDueCount);

  // Shows how many due surahs are still hidden.
  const remainingDueCount = Math.max(dueSurahs.length - visibleDueCount, 0);
  const normalizedSearch = surahSearch.trim().toLowerCase();

  const filteredManualSurahs = [...surahs]
    .filter((surah) => {
      const matchesJuz =
        selectedJuz === "all" || surah.juzNumber === selectedJuz;

      const matchesSearch = surah.surahName
        .toLowerCase()
        .includes(normalizedSearch);

      return matchesJuz && matchesSearch;
    })
    .sort((a, b) => {
      if (manualSort === "weakest") {
        const masteryDifference =
          MASTERY_SCORES[a.masteryLevel] - MASTERY_SCORES[b.masteryLevel];

        if (masteryDifference !== 0) {
          return masteryDifference;
        }
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  const visibleManualSurahs = filteredManualSurahs.slice(0, visibleManualCount);
  const remainingManualCount = Math.max(
    filteredManualSurahs.length - visibleManualCount,
    0,
  );

  const availableJuzNumbers = [
    ...new Set(surahs.map((surah) => surah.juzNumber)),
  ].sort((a, b) => a - b);

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
      } finally {
        setIsLoading(false);
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
            راجعي ما حان موعده، أو اختاري سورة بنفسكِ للمراجعة.
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
              {dueSurahs.length}
            </p>

            <p className="mt-1 text-xs text-gray-500">ورد اليوم</p>
          </div>

          <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-amber-600">
              {weakSurahsCount}
            </p>

            <p className="mt-1 text-xs text-gray-500">ضعيف</p>
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
                {dueSurahs.length === 0
                  ? "لا يوجد ورد"
                  : `${dueSurahs.length} سور مستحقة`}
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
          {/* Lets the user switch between due and manual reviews. */}
          <div
            className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-gray-100 p-1"
            aria-label="طريقة اختيار المراجعة"
          >
            <button
              type="button"
              aria-pressed={reviewMode === "suggested"}
              className={`rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                reviewMode === "suggested"
                  ? "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
                  : "bg-transparent text-gray-600 hover:bg-white hover:text-emerald-700"
              }`}
              onClick={() => setReviewMode("suggested")}
            >
              ✨ مقترحة لكِ
            </button>

            <button
              type="button"
              aria-pressed={reviewMode === "manual"}
              className={`rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                reviewMode === "manual"
                  ? "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
                  : "bg-transparent text-gray-600 hover:bg-white hover:text-emerald-700"
              }`}
              onClick={() => setReviewMode("manual")}
            >
              📖 اختاري سورة
            </button>
          </div>

          <div className="mt-5">
            {isLoading ? (
              <div
                role="status"
                className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-6 text-center"
              >
                <div
                  className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600"
                  aria-hidden="true"
                />

                <p className="mt-3 text-sm font-bold text-emerald-700">
                  جارٍ تحميل السور...
                </p>
              </div>
            ) : reviewMode === "suggested" ? (
              dueSurahs.length === 0 ? (
                surahs.length === 0 ? (
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
                  <div className="rounded-2xl border border-dashed border-gray-300 p-6 text-center">
                    <p className="text-4xl">🎉</p>

                    <h3 className="mt-3 font-bold text-gray-800">
                      لا توجد مراجعات مستحقة اليوم
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      أحسنتِ، لقد أكملتِ مراجعاتك المستحقة.
                    </p>
                  </div>
                )
              ) : (
                <div>
                  <div
                    className="space-y-3"
                    aria-label="السور المستحقة للمراجعة"
                  >
                    {visibleDueSurahs.map((surah) => (
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
                              الجزء {surah.juzNumber} • سورة رقم{" "}
                              {surah.surahNumber}
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
                  {dueSurahs.length > 3 && (
                    <div className="mt-4 flex gap-2">
                      {remainingDueCount > 0 && (
                        <button
                          type="button"
                          onClick={() =>
                            setVisibleDueCount((currentCount) =>
                              Math.min(currentCount + 3, dueSurahs.length),
                            )
                          }
                          className="flex-1 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
                        >
                          عرض المزيد ({remainingDueCount})
                        </button>
                      )}

                      {visibleDueCount > 3 && (
                        <button
                          type="button"
                          onClick={() => setVisibleDueCount(3)}
                          className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-gray-50"
                        >
                          عرض أقل
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            ) : surahs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 p-6 text-center">
                <p className="text-4xl">📖</p>

                <h3 className="mt-3 font-bold text-gray-800">
                  لا توجد سور بعد
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  أضيفي أول سورة محفوظة لتتمكني من اختيارها للمراجعة.
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
              <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 p-5">
                <div className="text-center">
                  <div
                    className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-sm"
                    aria-hidden="true"
                  >
                    📖
                  </div>

                  <h3 className="mt-4 font-bold text-gray-800">
                    اختاري سورة للمراجعة
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                    يمكنكِ مراجعة أي سورة محفوظة، حتى إذا لم يحن موعد مراجعتها
                    بعد.
                  </p>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {" "}
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-gray-700">
                      ابحثي باسم السورة
                    </span>

                    <input
                      type="search"
                      value={surahSearch}
                      onChange={(event) => {
                        setSurahSearch(event.target.value);
                        setVisibleManualCount(5);
                      }}
                      placeholder="مثال: الأنعام"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-gray-700">
                      اختاري الجزء
                    </span>
                    <div className="relative">
                      <select
                        value={selectedJuz}
                        onChange={(event) => {
                          setSelectedJuz(
                            event.target.value === "all"
                              ? "all"
                              : Number(event.target.value),
                          );
                          setVisibleManualCount(5);
                        }}
                        className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      >
                        <option value="all">كل الأجزاء</option>

                        {availableJuzNumbers.map((juzNumber) => (
                          <option key={juzNumber} value={juzNumber}>
                            الجزء {juzNumber}
                          </option>
                        ))}
                      </select>

                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-700"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.22 7.22a.75.75 0 0 1 1.06 0L10 10.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.28a.75.75 0 0 1 0-1.06Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>{" "}
                  </label>
                </div>

                <div className="mt-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-sm text-gray-500">
                      {filteredManualSurahs.length === 1
                        ? "سورة واحدة مطابقة"
                        : `${filteredManualSurahs.length} سور مطابقة`}
                    </p>

                    <label className="relative">
                      <span className="sr-only">ترتيب السور</span>

                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-700"
                      >
                        <path d="M3 6h14" />
                        <path d="M3 12h10" />
                        <path d="M3 18h6" />
                        <path d="m17 15 3 3 3-3" />
                        <path d="M20 6v12" />
                      </svg>

                      <select
                        value={manualSort}
                        onChange={(event) => {
                          setManualSort(
                            event.target.value as "newest" | "weakest",
                          );
                          setVisibleManualCount(5);
                        }}
                        className="cursor-pointer appearance-none rounded-xl border border-emerald-200 bg-white py-2 pl-8 pr-10 text-sm font-bold text-emerald-700 outline-none transition hover:bg-emerald-50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      >
                        <option value="newest">الأحدث إضافة</option>
                        <option value="weakest">الأضعف أولًا</option>
                      </select>

                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-700"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.22 7.22a.75.75 0 0 1 1.06 0L10 10.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.28a.75.75 0 0 1 0-1.06Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </label>
                  </div>

                  {filteredManualSurahs.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center">
                      <p className="text-3xl" aria-hidden="true">
                        🔍
                      </p>

                      <h4 className="mt-3 font-bold text-gray-800">
                        لا توجد سورة مطابقة
                      </h4>

                      <p className="mt-2 text-sm leading-6 text-gray-500">
                        جرّبي تغيير اسم السورة أو اختيار جزء آخر.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {visibleManualSurahs.map((surah) => {
                        const reviewStatus = getReviewDateStatus(
                          surah.nextReviewDate,
                        );
                        return (
                          <div
                            key={surah.id}
                            className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h4 className="font-bold text-gray-800">
                                  {surah.surahName}
                                </h4>
                                <p className="mt-1 text-xs text-gray-500">
                                  الجزء {surah.juzNumber} • سورة رقم{" "}
                                  {surah.surahNumber}
                                </p>
                                <p
                                  className={`my-2 w-fit rounded-full px-3 py-1 text-xs font-bold ${
                                    REVIEW_STATUS_STYLES[reviewStatus]
                                  }`}
                                >
                                  {REVIEW_STATUS_LABELS[reviewStatus]}
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
                        );
                      })}

                      {filteredManualSurahs.length > 5 && (
                        <div className="mt-4 flex gap-2">
                          {remainingManualCount > 0 && (
                            <button
                              type="button"
                              onClick={() =>
                                setVisibleManualCount((currentCount) =>
                                  Math.min(
                                    currentCount + 5,
                                    filteredManualSurahs.length,
                                  ),
                                )
                              }
                              className="flex-1 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
                            >
                              عرض المزيد ({remainingManualCount})
                            </button>
                          )}

                          {visibleManualCount > 5 && (
                            <button
                              type="button"
                              onClick={() => setVisibleManualCount(5)}
                              className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-gray-50"
                            >
                              عرض أقل
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
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
