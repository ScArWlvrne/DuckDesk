import EmailVerificationForm from '@/app/componenets/EmailVerificationForm';

export default function VerifyPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 py-12 px-4">
      <div className="w-full max-w-md">
        <EmailVerificationForm />
      </div>
    </main>
  );
}
