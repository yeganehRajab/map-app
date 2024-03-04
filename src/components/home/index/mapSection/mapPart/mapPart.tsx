import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { mapSectionStyles } from "./mapPart.styles";
import { myLocationMarker } from "./mapPart.types";
import { FC } from "react";

const MapPart: FC = () => {
  const zoom = 13;

  return (
    <MapContainer
      center={[51.505, -0.11]}
      zoom={zoom}
      style={mapSectionStyles.containerSx()}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker icon={myLocationMarker} position={[51.505, -0.09]} />
      <Marker icon={myLocationMarker} position={[51.505, -0.1]} />
      <Marker icon={myLocationMarker} position={[51.505, -0.11]} />
      <Marker icon={myLocationMarker} position={[51.505, -0.13]} />
    </MapContainer>
  );
};

export default MapPart;