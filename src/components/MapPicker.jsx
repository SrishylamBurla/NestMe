"use client";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useCallback, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "16px",
};

export default function MapPicker({ onSelect }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
  });

  const [marker, setMarker] = useState(null);

  const handleClick = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    setMarker({ lat, lng });
    onSelect({ lat, lng }); // send to parent
  }, [onSelect]);

  if (!isLoaded) return <p>Loading Map...</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat: 12.9716, lng: 77.5946 }} // default Bangalore
      zoom={12}
      onClick={handleClick}
    >
      {marker && <Marker position={marker} />}
    </GoogleMap>
  );
}
