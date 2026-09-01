import { credentialLogIn } from "@/lib/auth-actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CredSignIn() {
  const [warning, setWarning] = useState({ message: "", type: "" }); // Lets us warn the user if their password is incorrect.
  const { update } = useSession();

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    const result = await credentialLogIn(email, password);

    await update();

    if (result?.error) {
      setWarning({
        message: "Incorrect email or password. Try again?",
        type: "warning",
      });
    } else {
      window.location.href = "/problems-library";
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <form
        className="my-4 w-full flex flex-col items-center"
        onSubmit={handleLogin}
      >
        <input
          className="w-full flex-1 min-w-0 bg-neutral-900/80 px-3 py-3 mb-1.5 rounded-lg text-sm text-monaco-txt focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Email"
          type="email"
          name="email"
          id="email"
        />
        <input
          className="w-full flex-1 min-w-0 bg-neutral-900/80 px-3 py-3 my-1.5 rounded-lg text-sm text-monaco-txt focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Password"
          type="password"
          name="password"
          id="password"
        />
        <button
          type="submit"
          className="bg-monaco-mid mt-1.5 rounded-lg py-3 flex justify-center items-center text-sm w-full cursor-pointer hover:bg-yellow-600 transition-colors shadow-lg shadow-black/20"
        >
          Sign in
        </button>
        {warning.message && (
          <div
            className={`warning ${warning.type}`}
            style={{
              padding: "10px",
              color: "#ef4444",
            }}
          >
            {warning.message}
          </div>
        )}
      </form>
    </div>
  );
}
