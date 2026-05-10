import { signIn } from "@/auth"
import { handleSignIn } from "@/lib/auth-actions";

export default function SignIn() {
  return (
    <form action={handleSignIn}>
      <button 
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Sign In with Google
      </button>
    </form>
  );
}