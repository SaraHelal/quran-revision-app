type ActiveReviewCardProps = {
  surahName?: string;
  onContinue: () => void;
  onCancel: () => void;
};

function ActiveReviewCard({
  surahName,
  onContinue,
  onCancel,
}: ActiveReviewCardProps) {
  return (
    <section className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-6">
      <p className="mb-2 text-sm font-bold text-amber-700">
        مراجعة غير مكتملة
      </p>

      <h2 className="text-xl font-bold text-gray-900">
        {surahName
          ? `لم تكتمل مراجعة سورة ${surahName}`
          : "لديكِ جلسة مراجعة لم تُستكمل بعد"}
      </h2>

      <p className="mt-2 text-sm leading-7 text-gray-600">
        يمكنكِ العودة إلى السورة ومتابعة المراجعة من حيث توقفتِ.
      </p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onContinue}
          className="flex-1 rounded-2xl bg-amber-600 px-5 py-3 font-bold text-white transition hover:bg-amber-700"
        >
          متابعة المراجعة
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-2xl border border-gray-300 bg-white px-5 py-3 font-bold text-gray-700 transition hover:bg-gray-100"
        >
          إلغاء المراجعة
        </button>
      </div>
    </section>
  );
}

export default ActiveReviewCard;