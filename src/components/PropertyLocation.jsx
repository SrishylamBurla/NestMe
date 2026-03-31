export default function PropertyLocation({ location }) {
  if (!location?.lat || !location?.lng) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 px-4 pt-4">Location</h2>

      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
        <iframe
          className="w-full h-[300px] sm:h-[400px] rounded-b-2xl"
          loading="lazy"
          src={`https://www.google.com/maps?q=${location.lat},${location.lng}&output=embed`}
        />
      </div>
    </div>
  );
}