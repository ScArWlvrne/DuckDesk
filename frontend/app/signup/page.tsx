import SignupForm from '@/app/componenets/SignupForm';

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 py-12 px-4">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </main>
  );
}
