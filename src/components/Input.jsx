export default function Input({ label, ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-semibold">{label}</label>
      <input
        {...props}
        className="w-full h-11 border rounded-lg px-3"
      />
    </div>
  );
}
