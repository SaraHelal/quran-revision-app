type ReviewConflictModalProps = {
  activeSurahName?: string;
  onContinueReview: () => void;
  onStartNewReview: () => void;
  onClose: () => void;
};

function ReviewConflictModal({
  activeSurahName,
  onContinueReview,
  onStartNewReview,
  onClose,
}: ReviewConflictModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-conflict-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2
          id="review-conflict-title"
          className="text-center text-xl font-bold text-gray-900"
        >
          لديك مراجعة غير مكتملة
        </h2>

        {activeSurahName && (
          <p className="mt-2 text-center text-base text-gray-600">
            المراجعة الحالية لسورة{" "}
            <span className="font-bold text-gray-900">
              {activeSurahName}
            </span>
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={onContinueReview}
            className="w-full rounded-2xl bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-700"
          >
            استكمال المراجعة السابقة
          </button>

          <button
            type="button"
            onClick={onStartNewReview}
            className="w-full rounded-2xl bg-amber-500 px-5 py-3 font-bold text-white transition hover:bg-amber-600"
          >
            بدء المراجعة الجديدة
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-3 font-bold text-gray-700 transition hover:bg-gray-100"
          >
            الرجوع
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewConflictModal;