export default function CredSignIn() {
  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    console.log("I'm loggin in: " + email + " " + password);

    // Add spot for Registering account.
  };

  return (
    <form
      className="my-5 flex flex-col items-center border p-3 border-gray-200 rounded-md"
      onSubmit={handleLogin}
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
        Login
      </button>
    </form>
  );
}
