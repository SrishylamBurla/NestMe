export default function PropertyLocation({ location }) {
  if (!location?.lat || !location?.lng) return null;

  return (
    <div>
      <h2 className="text-lg font-bold mb-3">Location</h2>


      <div className="bg-white/70 backdrop-blur-xl border border-white/40 p-4 rounded-3xl shadow-lg">

        <iframe
          className="w-full h-full"
          loading="lazy"
          src={`https://www.google.com/maps?q=${location.lat},${location.lng}&output=embed`}
        />
        </div>
      
    </div>
  );
}
