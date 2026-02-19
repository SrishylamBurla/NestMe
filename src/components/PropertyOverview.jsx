export default function PropertyOverview({ property }) {
  const price = new Intl.NumberFormat("en-IN").format(
    property.priceValue || 0
  );

  return (
    <div className="backdrop-blur-xl bg-white/70 border border-white/40 rounded-3xl p-6 shadow-xl">

      <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">

        {property.title}
      </h1>

      <p className="text-sm text-gray-500 mt-1">
        {property.city}, {property.state}
      </p>

      <div className="flex justify-between items-end mt-5">
        <div>
          <p className="text-xs text-gray-400 uppercase">Total Price</p>
          <p className="text-4xl font-extrabold text-slate-900 tracking-tight">
₹ {price}</p>
        </div>

        <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 text-white text-xs font-bold shadow-md">

          {property.listingType === "sale" ? "For Sale" : "For Rent"}
        </span>
      </div>
    </div>
  );
}
