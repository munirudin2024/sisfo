import { useEffect, useState } from "react";
import { collection, onSnapshot, addDoc, setDoc, doc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import type { Role } from "../types";

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const col = collection(db, "roles");
    const unsub = onSnapshot(col, (snap) => {
      const arr: Role[] = [];
      snap.forEach((d) => arr.push(d.data() as Role));
      setRoles(arr);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const addRole = async (r: Partial<Role>) => {
    const docRef = await addDoc(collection(db, "roles"), r as Role);
    return docRef.id;
  };

  const updateRole = async (id: string, r: Partial<Role>) => {
    await setDoc(doc(db, "roles", id), r as Role);
  };

  const removeRole = async (id: string) => {
    await deleteDoc(doc(db, "roles", id));
  };

  const getRole = async (id: string) => {
    const snap = await getDoc(doc(db, "roles", id));
    return snap.exists() ? (snap.data() as Role) : null;
  };

  return { roles, loading, addRole, updateRole, removeRole, getRole };
}
