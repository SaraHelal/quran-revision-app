import { COLLECTIONS } from "../../../constants/firebaseCollections";
import type {
  CreateMemorizationUnitData,
  MasteryLevel,
  MemorizationUnit,
} from "../../../types";
import { db } from "../../../services/firebase/firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getDoc,
  limit,
  query,
  where,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { MASTERY_SCORES } from "../../../constants/mastery";
import { calculateNextReviewDate } from "../../reviews/utils/reviewSchedule";
export async function addMemorizationUnit(
  userId: string,
  data: CreateMemorizationUnitData,
) {
  const now = new Date().toISOString();
  const duplicateQuery = query(
    collection(db, COLLECTIONS.MEMORIZATION_UNITS),
    where("userId", "==", userId),
    where("surahNumber", "==", data.surahNumber),
    limit(1),
  );
  const duplicateSnapshot = await getDocs(duplicateQuery);
  if (!duplicateSnapshot.empty) {
    throw new Error("DUPLICATE_SURAH");
  }
  const docRef = await addDoc(collection(db, COLLECTIONS.MEMORIZATION_UNITS), {
    userId,
    ...data,
    masteryScore: MASTERY_SCORES[data.masteryLevel],
    lastReviewDate: null,
    nextReviewDate: now,
    createdAt: now,
    updatedAt: now,
  });

  return docRef.id;
}

export async function getUserMemorizationUnits(
  userId: string,
): Promise<MemorizationUnit[]> {
  const memorizationCollection = collection(db, COLLECTIONS.MEMORIZATION_UNITS);

  const q = query(memorizationCollection, where("userId", "==", userId));

  const snapshot = await getDocs(q);

  const units = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as MemorizationUnit[];

  return units;
}

export async function getMemorizationUnitById(
  userId: string,
  unitId: string,
): Promise<MemorizationUnit | null> {
  const unitRef = doc(db, COLLECTIONS.MEMORIZATION_UNITS, unitId);
  const snapshot = await getDoc(unitRef);

  if (!snapshot.exists()) {
    return null;
  }

  const unit = {
    id: snapshot.id,
    ...snapshot.data(),
  } as MemorizationUnit;

  if (unit.userId !== userId) {
    return null;
  }

  return unit;
}



export async function completeMemorizationUnitReview(
  userId: string,
  unitId: string,
  masteryLevel: MasteryLevel,
) {
  const unitRef = doc(db, COLLECTIONS.MEMORIZATION_UNITS, unitId);
  const unitSnapshot = await getDoc(unitRef);

  if (!unitSnapshot.exists()) {
    throw new Error("Memorization unit not found");
  }

  const unit = unitSnapshot.data() as MemorizationUnit;

  if (unit.userId !== userId) {
    throw new Error("Unauthorized review attempt");
  }

  const reviewedAt = new Date();
  const reviewDate = reviewedAt.toISOString();
  const nextReviewDate = calculateNextReviewDate(
    masteryLevel,
    reviewedAt,
  );
  const masteryScore = MASTERY_SCORES[masteryLevel];

  const historyRef = doc(
    collection(db, COLLECTIONS.REVIEW_HISTORY),
  );

  const batch = writeBatch(db);

  batch.update(unitRef, {
    masteryLevel,
    masteryScore,
    lastReviewDate: reviewDate,
    nextReviewDate,
    updatedAt: reviewDate,
  });

  batch.set(historyRef, {
    userId,
    memorizationUnitId: unitId,
    reviewDate,
    result: masteryLevel,
    scoreAfterReview: masteryScore,
    createdAt: reviewDate,
  });

  await batch.commit();
}


type UpdateMemorizationUnitData = {
  memorizedAt: string;
  masteryLevel: MasteryLevel;
};

export async function updateMemorizationUnit(
  userId: string,
  unitId: string,
  data: UpdateMemorizationUnitData,
) {
  const unitRef = doc(db, COLLECTIONS.MEMORIZATION_UNITS, unitId);
  const unitSnapshot = await getDoc(unitRef);

  if (!unitSnapshot.exists()) {
    throw new Error("Memorization unit not found");
  }

  const unit = unitSnapshot.data() as MemorizationUnit;

  if (unit.userId !== userId) {
    throw new Error("Unauthorized update attempt");
  }

  await updateDoc(unitRef, {
    ...data,
    masteryScore: MASTERY_SCORES[data.masteryLevel],
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteMemorizationUnit(userId: string, unitId: string) {
  const unitRef = doc(db, COLLECTIONS.MEMORIZATION_UNITS, unitId);
  const unitSnapshot = await getDoc(unitRef);

  if (!unitSnapshot.exists()) {
    throw new Error("Memorization unit not found");
  }

  const unit = unitSnapshot.data() as MemorizationUnit;

  if (unit.userId !== userId) {
    throw new Error("Unauthorized deletion attempt");
  }

  const historyQuery = query(
    collection(db, COLLECTIONS.REVIEW_HISTORY),
    where("userId", "==", userId),
    where("memorizationUnitId", "==", unitId),
  );

  const historySnapshot = await getDocs(historyQuery);
  const batch = writeBatch(db);

  historySnapshot.docs.forEach((historyDocument) => {
    batch.delete(historyDocument.ref);
  });

  batch.delete(unitRef);

  await batch.commit();
}

