import { COLLECTIONS } from "../../../constants/firebaseCollections";
import type { CreateMemorizationUnitData, MemorizationUnit } from "../../../types";
import { db } from "../../../services/firebase/firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

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