import LoginForm from '@/components/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-wg-black px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            WingfieldGemini
          </h1>
          <h2 className="text-2xl font-medium text-gray-300">
            Client Portal
          </h2>
          <p className="mt-4 text-sm text-gray-400">
            Sign in to access your project dashboard
          </p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  )
}