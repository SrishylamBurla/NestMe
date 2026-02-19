export default function Button({ children }) {
  return (
    <button className="w-full h-11 bg-black text-white rounded-lg font-bold">
      {children}
    </button>
  );
}
