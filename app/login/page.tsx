import LoginButton from "@/components/LoginButton";

export default function LoginPage() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">

      <div className="bg-white p-10 rounded-2xl shadow-xl text-center">
        <h1 className="text-2xl font-bold mb-6 text-indigo-700">Smart Bookmark App</h1>
        <LoginButton />
      </div>

    </div>
  );
}
