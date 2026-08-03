import { COLLECTIONS } from "../../../constants/firebaseCollections";
import type { CreateMemorizationUnitData, MasteryLevel, MemorizationUnit } from "../../../types";
import { db } from "../../../services/firebase/firebase";
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { MASTERY_SCORES } from "../../../constants/mastery";

export async function addMemorizationUnit(
  userId: string,
  data: CreateMemorizationUnitData,
) {
  const now = new Date().toISOString();

  const docRef = await addDoc(collection(db, COLLECTIONS.MEMORIZATION_UNITS), {
    userId,
    ...data,
    masteryScore: 0,
    lastReviewDate: null,
    nextReviewDate: null,
    createdAt: now,
    updatedAt: now,
  });

  return docRef.id;
}
export async function addReviewHistory(
  userId: string,
  unitId: string,
  masteryLevel: MasteryLevel ,
) {
  const now = new Date().toISOString();
  const docRef =await addDoc(
  collection(db, COLLECTIONS.REVIEW_HISTORY),
  {
    userId,
    memorizationUnitId: unitId,
    reviewDate: now,
    result: masteryLevel,
    scoreAfterReview: MASTERY_SCORES[masteryLevel],
    createdAt: now,
  }
);

  return docRef.id;
}

export async function getUserMemorizationUnits(
  userId: string
): Promise<MemorizationUnit[]> {
  const memorizationCollection = collection(
    db,
    COLLECTIONS.MEMORIZATION_UNITS
  );

  const q = query(
    memorizationCollection,
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(q);

  const units = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as MemorizationUnit[];

  return units;
}

export async function updateMemorizationUnitReview(
  userId: string,
  unitId: string,
  masteryLevel: MasteryLevel
) {
  const unitRef = doc(db, COLLECTIONS.MEMORIZATION_UNITS, unitId);

  await updateDoc(unitRef, {
    masteryLevel,
    lastReviewDate: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}