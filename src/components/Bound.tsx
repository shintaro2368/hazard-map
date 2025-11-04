import { LatLngLiteral } from "leaflet";
import { useMap } from "react-leaflet";

/**
 * 与えられた座標を中心とした位置に地図を移動させる
 * @param param0
 * @returns
 */
export default function Bounds({ position }: { position: LatLngLiteral }) {
  const map = useMap();
  map.fitBounds([
    [position.lat, position.lng],
    [position.lat, position.lng],
  ]);
  return null;
}
