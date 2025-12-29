import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User as FirebaseUser } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";
import type { User, Role, Department } from "../types";

interface AuthContextType {
  firebaseUser: FirebaseUser | null | undefined;
  userData: User | null;
  currentRoles: Role[];
  currentDepartments: Department[];
  loading: boolean;
  hasPermission: (action: string, resource: string) => boolean;
  hasRole: (roleName: string) => boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, firebaseLoading] = useAuthState(auth);
  const [userData, setUserData] = useState<User | null>(null);
  const [currentRoles, setCurrentRoles] = useState<Role[]>([]);
  const [currentDepartments, setCurrentDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseUser) {
      setUserData(null);
      setCurrentRoles([]);
      setCurrentDepartments([]);
      setLoading(false);
      return;
    }

    // Fetch user data dari Firestore
    const fetchUserData = async () => {
      try {
        // TODO: Fetch dari Firestore
        // Untuk sekarang mock data
        const mockUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          displayName: firebaseUser.displayName || "User",
          roleIds: ["admin"],
          departmentIds: ["dept-1"],
          isActive: true,
          createdAt: new Date(),
        };
        setUserData(mockUser);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      setLoading(false);
    };

    if (!firebaseLoading) {
      fetchUserData();
    }
  }, [firebaseUser, firebaseLoading]);

  const hasPermission = (action: string, resource: string): boolean => {
    // Check if user has any role with this permission
    return currentRoles.some((role) =>
      role.permissions.some(
        (perm) => perm.action === action && perm.resource === resource
      )
    );
  };

  const hasRole = (roleName: string): boolean => {
    return currentRoles.some((role) => role.name === roleName);
  };

  const isAdmin = hasRole("admin");

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        userData,
        currentRoles,
        currentDepartments,
        loading,
        hasPermission,
        hasRole,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
