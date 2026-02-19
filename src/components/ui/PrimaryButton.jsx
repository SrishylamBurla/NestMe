export default function PrimaryButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="
        inline-flex items-center gap-2
        px-4 py-2
        rounded-lg
        border border-gray-300
        bg-white
        text-sm font-medium
        shadow-sm
        hover:shadow-md
        active:scale-[0.98]
        transition
      "
    >
      {children}
    </button>
  );
}
