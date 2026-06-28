import { MapContainer,TileLayer,Marker,Popup } from "react-leaflet";

import "leaflet/dist/leaflet.css";

import L from "leaflet";

import centers from "../data/collectionCenters";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({

iconRetinaUrl:
"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

iconUrl:
"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

shadowUrl:
"https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

});

function CollectionMap(){

return(

<MapContainer
center={[16.5449,81.5212]}
zoom={13}
style={{
height:"600px",
width:"100%",
borderRadius:"15px"
}}
>

<TileLayer

url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

/>

{

centers.map(center=>(

<Marker
key={center.id}
position={[center.lat,center.lng]}
>

<Popup>

<h3>{center.name}</h3>

<p>

<b>Type:</b>

{center.type}

</p>

<p>

<b>Address:</b>

{center.address}

</p>

<p>

<b>Hours:</b>

{center.hours}

</p>

<p>

<b>Phone:</b>

{center.phone}

</p>

<p>

<b>Accepts:</b>

{center.accepted.join(", ")}

</p>

</Popup>

</Marker>

))

}

</MapContainer>

)

}

export default CollectionMap;