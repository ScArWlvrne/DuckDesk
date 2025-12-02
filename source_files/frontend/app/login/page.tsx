// import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '@/app/componenets/LoginForm';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 py-12 px-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}