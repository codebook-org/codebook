import { signIn } from "@/auth";
import { handleSignIn } from "@/lib/auth-actions";

import Button from "@/components/Button";

export default function SignIn() {
  return (
    <Button type="submit" text="Sign In With Google" onClick={handleSignIn} />
  );
}
