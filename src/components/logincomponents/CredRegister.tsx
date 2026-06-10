import { fakeUsers } from "@/lib/data";

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
        className="my-5 flex flex-col items-center border p-3 border-gray-200 rounded-md"
        onSubmit={handleRegister}
      >
        <div className="my-2">
          <label htmlFor="password">Display Name</label>
          <input
            className="border mx-2 border-gray-500 rounded"
            name="displayName"
            id="displayName"
          />
        </div>

        <div className="my-2">
          <label htmlFor="password">Username</label>
          <input
            className="border mx-2 border-gray-500 rounded"
            name="username"
            id="username"
            onKeyDown={(e) => {
                if (e.key === " ") {
                  e.preventDefault(); // Explicitly cancels the spacebar character entry
                }
            }}
          />
        </div>

        <div className="my-2">
          <label htmlFor="email">Email Address</label>
          <input
            className="border mx-2 border-gray-500 rounded"
            type="email"
            name="email"
            id="email"
          />
        </div>

        <div className="my-2">
          <label htmlFor="password">Password</label>
          <input
            className="border mx-2 border-gray-500 rounded"
            type="password"
            name="password"
            id="password"
          />
        </div>

        <button
          type="submit"
          className="bg-orange-300 mt-4 rounded flex justify-center items-center w-36"
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
