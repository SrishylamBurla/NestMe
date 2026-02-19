export default function SearchResultsHeader({ onClose }) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
      {/* TOP */}
      <div className="flex items-center gap-3 p-4">
        <button onClick={onClose}>
          <span className="material-symbols-outlined">
            arrow_back_ios
          </span>
        </button>

        <div className="flex-1 overflow-hidden">
          <h1 className="text-base font-bold truncate">
            Gachibowli, Hyderabad
          </h1>
          <p className="text-xs text-gray-500 truncate">
            Buy • 2, 3 BHK • ₹20L - ₹1.5Cr
          </p>
        </div>

        <button className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="material-symbols-outlined">
            search
          </span>
        </button>
      </div>

      {/* META */}
      <div className="flex items-center justify-between px-4 pb-3">
        <div className="flex gap-1 text-sm">
          <span className="font-semibold">145</span>
          <span className="text-gray-500">Properties found</span>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-1 px-3 py-1.5 border rounded-lg text-xs font-semibold">
            <span className="material-symbols-outlined text-sm">
              sort
            </span>
            Sort
          </button>

          <button className="flex items-center gap-1 px-3 py-1.5 border rounded-lg text-xs font-semibold">
            <span className="material-symbols-outlined text-sm text-blue-600">
              filter_list
            </span>
            Filter
            <span className="ml-1 bg-blue-600 text-white text-[10px] rounded-full px-1.5">
              2
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
