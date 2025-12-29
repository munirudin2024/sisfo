import { useEffect, useState } from "react";
import { collection, onSnapshot, addDoc, setDoc, doc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import type { User } from "../types";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const col = collection(db, "users");
    const unsub = onSnapshot(col, (snap) => {
      const arr: User[] = [];
      snap.forEach((d) => arr.push(d.data() as User));
      setUsers(arr);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const addUser = async (u: Partial<User>) => {
    const docRef = await addDoc(collection(db, "users"), u as User);
    return docRef.id;
  };

  const updateUser = async (id: string, u: Partial<User>) => {
    await setDoc(doc(db, "users", id), u as User);
  };

  const removeUser = async (id: string) => {
    await deleteDoc(doc(db, "users", id));
  };

  const getUser = async (id: string) => {
    const snap = await getDoc(doc(db, "users", id));
    return snap.exists() ? (snap.data() as User) : null;
  };

  return { users, loading, addUser, updateUser, removeUser, getUser };
}
