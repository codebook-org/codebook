import { handleSignOut } from "@/lib/auth-actions";

export default function SignOut() {
  return (
    <form action={handleSignOut}>
      <button 
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Sign Out
      </button>
    </form>
  );
}