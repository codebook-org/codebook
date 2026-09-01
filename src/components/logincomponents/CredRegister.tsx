import { credentialLogIn, registerAndLogin } from "@/lib/auth-actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CredRegister() {
  const [warning, setWarning] = useState({ message: "", type: "" }); // Lets us warn the user if their password is incorrect.
  const { update } = useSession();

  const handleRegister = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;
    const displayName = e.target.displayName.value;
    const username = e.target.username.value;

    if (!username) {
      setWarning({
        message: "You need a username!",
        type: "warning",
      });
      return;
    } else if (!email) {
      setWarning({
        message: "You need an email!",
        type: "warning",
      });
      return;
    } else if (!password) {
      setWarning({
        message: "You need a password!",
        type: "warning",
      });
      return;
    } else {
      // We'll handle the registering off this page.
      const result = await registerAndLogin(
        email,
        password,
        displayName || username,
        username,
      );

      if (result?.error) {
        if (result.error == "USERNAME_TAKEN") {
          setWarning({
            message: "That username is already taken. Try another one!",
            type: "warning",
          });
        } else if (result.error == "EMAIL_TAKEN") {
          setWarning({
            // If we're getting an error in this case, it should be becuase the password matching an existing account isn't correct.
            message: "This email has already been used.",
            type: "warning",
          });
        }
      } else {
        window.location.href = "/problems-library";
      }
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <form
        className="my-4 w-full flex flex-col items-center"
        onSubmit={handleRegister}
      >
        <input
          className="w-full flex-1 min-w-0 bg-neutral-900/80 px-3 py-3 mb-1 rounded-lg text-sm text-monaco-txt focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Display name"
          name="displayName"
          id="displayName"
        />
        <input
          className="w-full flex-1 min-w-0 bg-neutral-900/80 px-3 py-3 my-1 rounded-lg text-sm text-monaco-txt focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Username"
          name="username"
          id="username"
          onKeyDown={(e) => {
            if (e.key === " ") {
              e.preventDefault(); // Explicitly cancels the spacebar character entry
            }
          }}
        />
        <input
          className="w-full flex-1 min-w-0 bg-neutral-900/80 px-3 py-3 my-1 rounded-lg text-sm text-monaco-txt focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Email"
          type="email"
          name="email"
          id="email"
        />
        <input
          className="w-full flex-1 min-w-0 bg-neutral-900/80 px-3 py-3 my-1 rounded-lg text-sm text-monaco-txt focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Password"
          type="password"
          name="password"
          id="password"
        />
        <button
          type="submit"
          className="bg-monaco-mid mt-1 rounded-lg py-3 flex justify-center items-center text-sm w-full cursor-pointer hover:bg-yellow-600 transition-colors shadow-lg shadow-black/20"
        >
          Register
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
