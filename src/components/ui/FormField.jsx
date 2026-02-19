export default function FormField({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-600">
        {label}
      </label>

      <input
        {...props}
        className="
          h-11
          rounded-lg
          border border-gray-300
          px-3
          text-sm
          bg-white
          shadow-sm
          focus:outline-none
          focus:ring-2 focus:ring-black/10
          focus:border-black/20
          transition
        "
      />
    </div>
  );
}
