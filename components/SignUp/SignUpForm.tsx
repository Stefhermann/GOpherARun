import TextField from "../ui/textfield";
import SubmitButton from "./SubmitButton";
import AuthFooter from "./AuthFooter";
import { signup } from "@/app/signup/actions";

export default function SignUpForm() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/GopherRunBackground.webp')] bg-cover bg-no-repeat">
      <form
        action={signup}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-[#7A0019]">
          Join Gopher Run
        </h2>

        <TextField name="email" type="email" label="Email" required />

        <TextField
          name="password"
          type="password"
          label="Password"
          required
          minLength={8}
        />

        {/* Add this new field */}
        <TextField
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          required
          minLength={8}
        />

        <TextField
          name="username"
          label="Username"
          required
          minLength={3}
          maxLength={32}
        />

        <TextField name="firstName" label="First Name" required />

        <TextField name="lastName" label="Last Name" />

        <TextField name="bio" label="Bio" isTextArea rows={3} />

        <TextField
          name="pronouns"
          label="Pronouns"
          placeholder="e.g., she/her, they/them"
        />

        <SubmitButton />
        <AuthFooter />
      </form>
    </div>
  );
}
