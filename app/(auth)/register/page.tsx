import Link from "next/link";
import SignUpForm from "./SignUpForm";

export default function SignUp() {
  return (
    <div className="w-full flex mt-20 justify-center">
      <section className="flex flex-col w-[400px]">
        <h1 className="text-3xl w-full text-center font-bold mb-6">Sign Up</h1>
        <SignUpForm />
        <div className="mt-2 flex items-center mt-6">
          <h1>Already have an account?</h1>
          <Link className="font-bold ml-2" href="/login">
            Sign In
          </Link>
        </div>
      </section>
    </div>
  );
}
