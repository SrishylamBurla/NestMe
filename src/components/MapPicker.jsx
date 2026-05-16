"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";

import { useState } from "react";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

// 🔥 FIX DEFAULT MARKER ICON
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// =========================
// LOCATION PICKER
// =========================

function LocationMarker({
  onSelect,
}) {
  const [position, setPosition] =
    useState(null);

  useMapEvents({
    click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      setPosition([lat, lng]);

      onSelect({
        lat,
        lng,
      });
    },
  });

  return position ? (
    <Marker position={position} />
  ) : null;
}

// =========================
// MAIN COMPONENT
// =========================

export default function MapPicker({
  onSelect,
  initialPosition,
}) {
  return (
    <div
      className="
      overflow-hidden
      rounded-[28px]
      border
      border-slate-200
      shadow-sm
      "
    >
      <MapContainer
        center={
          initialPosition
            ? [
              initialPosition.lat,
              initialPosition.lng,
            ]
            : [17.385, 78.4867]
        }
        zoom={12}
        scrollWheelZoom={true}
        className="h-[400px] w-full z-10"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationMarker
          onSelect={onSelect}
        />
      </MapContainer>
    </div>
  );
}



// "use client";

// import {
//   GoogleMap,
//   Marker,
//   useLoadScript,
//   StandaloneSearchBox,
// } from "@react-google-maps/api";
// import dynamic from "next/dynamic";

// import {
//   useCallback,
//   useRef,
//   useState,
// } from "react";

// const libraries = ["places"];

// const containerStyle = {
//   width: "100%",
//   height: "380px",
//   borderRadius: "24px",
// };

// export default function MapPicker({
//   onSelect,
// }) {
//   const { isLoaded } = useLoadScript({
//     googleMapsApiKey:
//       process.env
//         .NEXT_PUBLIC_GOOGLE_MAPS_KEY,

//     libraries,
//   });

//   const searchRef = useRef(null);

//   const [marker, setMarker] =
//     useState({
//       lat: 12.9716,
//       lng: 77.5946,
//     });

//   // =========================
//   // CLICK MAP
//   // =========================

//   const handleClick = useCallback(
//     (e) => {
//       const lat = e.latLng.lat();
//       const lng = e.latLng.lng();

//       setMarker({ lat, lng });

//       onSelect({
//         lat,
//         lng,
//       });
//     },
//     [onSelect]
//   );

//   // =========================
//   // SEARCH PLACE
//   // =========================

//   const onPlacesChanged = () => {
//     const places =
//       searchRef.current.getPlaces();

//     if (!places.length) return;

//     const place = places[0];

//     const lat =
//       place.geometry.location.lat();

//     const lng =
//       place.geometry.location.lng();

//     setMarker({ lat, lng });

//     onSelect({
//       lat,
//       lng,
//       address:
//         place.formatted_address,
//     });
//   };

//   // =========================
//   // CURRENT LOCATION
//   // =========================

//   const getCurrentLocation = () => {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const lat =
//           position.coords.latitude;

//         const lng =
//           position.coords.longitude;

//         setMarker({ lat, lng });

//         onSelect({
//           lat,
//           lng,
//         });
//       }
//     );
//   };

//   if (!isLoaded)
//     return (
//       <div className="h-[380px] rounded-3xl bg-slate-100 flex items-center justify-center">
//         Loading Map...
//       </div>
//     );

//   return (
//     <div className="space-y-4">

//       {/* SEARCH */}
//       <div className="flex gap-3">

//         <StandaloneSearchBox
//           onLoad={(ref) =>
//             (searchRef.current = ref)
//           }
//           onPlacesChanged={
//             onPlacesChanged
//           }
//         >
//           <input
//             type="text"
//             placeholder="Search property location..."
//             className="
//             w-full
//             h-12
//             px-4
//             rounded-2xl
//             border
//             border-slate-200
//             outline-none
//             focus:ring-2
//             focus:ring-indigo-500
//             "
//           />
//         </StandaloneSearchBox>

//         {/* CURRENT LOCATION */}
//         <button
//           type="button"
//           onClick={
//             getCurrentLocation
//           }
//           className="
//           px-5
//           rounded-2xl
//           bg-black
//           text-white
//           font-semibold
//           whitespace-nowrap
//           "
//         >
//           Use Current
//         </button>

//       </div>

//       {/* MAP */}
//       <div className="overflow-hidden rounded-[28px] border border-slate-200 shadow-sm">

//         <GoogleMap
//           mapContainerStyle={
//             containerStyle
//           }
//           center={marker}
//           zoom={14}
//           onClick={handleClick}
//           options={{
//             fullscreenControl: false,
//             streetViewControl: false,
//             mapTypeControl: false,
//           }}
//         >
//           <Marker
//             position={marker}
//             draggable={true}
//             onDragEnd={(e) => {
//               const lat =
//                 e.latLng.lat();

//               const lng =
//                 e.latLng.lng();

//               setMarker({
//                 lat,
//                 lng,
//               });

//               onSelect({
//                 lat,
//                 lng,
//               });
//             }}
//           />
//         </GoogleMap>

//       </div>

//       {/* COORDINATES */}
//       <div className="grid grid-cols-2 gap-4">

//         <div className="bg-slate-100 rounded-2xl p-4">
//           <p className="text-xs text-slate-500">
//             Latitude
//           </p>

//           <p className="font-bold mt-1">
//             {marker.lat.toFixed(6)}
//           </p>
//         </div>

//         <div className="bg-slate-100 rounded-2xl p-4">
//           <p className="text-xs text-slate-500">
//             Longitude
//           </p>

//           <p className="font-bold mt-1">
//             {marker.lng.toFixed(6)}
//           </p>
//         </div>

//       </div>
//     </div>
//   );
// }