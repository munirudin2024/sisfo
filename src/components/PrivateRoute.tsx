import { Navigate } from "react-router-dom";
import { auth } from "../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";

type Props = {
  children: JSX.Element;
};

export default function PrivateRoute({ children }: Props) {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p>Loading...</p>;
  return user ? children : <Navigate to="/login" replace />;
}