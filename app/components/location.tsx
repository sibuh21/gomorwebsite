"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const Map = () => {
  const position: [number, number] = [9.020858418116463, 38.79690183773888]; 

  return (
    <MapContainer center={position} zoom={13} style={{ height: "200px", width: "90%", margin:"auto" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={position} icon={markerIcon}>
        <Popup>Grace City Mall</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
