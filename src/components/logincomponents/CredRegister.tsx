import { fakeUsers } from "@/lib/data";

import { credentialLogIn, registerAndLogin } from "@/lib/auth-actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CredRegister() {
  const { update } = useSession();

  const handleRegister = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    // We'll handle the registering off this page.
    const result = await registerAndLogin(email, password);

    if (result?.error) {
    } else {
      window.location.href = "/problems-library";
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center">
    <form
      className="my-5 flex flex-col items-center border p-3 border-gray-200 rounded-md"
      onSubmit={handleRegister}
    >
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
    </form>
    </div>
  );
}
