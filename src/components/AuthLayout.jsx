export default function AuthLayout({ title, children }) {
  return (
    <div className="min-h-screen bg-[#F2F4F3] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl inner-shadow">
        <h1 className="text-2xl font-bold font-sans mb-6 text-center">{title}</h1>
        {children}
      </div>
    </div>
  );
}
