import { useAtomValue } from "jotai";
import { TileLayer } from "leaflet";
import { useMap } from "react-leaflet";
import { HAZARD_LAYER_ID, HAZARD_LAYER_OPTIONS } from "../lib/constants";
import { hazardUrlAtom } from "../lib/global-state";

/**
 * 主要災害レイヤーの切り替えを行う
 * @returns
 */
export default function HazardLayer() {
  const map = useMap();
  const hazardUrlValue = useAtomValue(hazardUrlAtom);

  map.eachLayer((el) => {
    if (el instanceof TileLayer) {
      const tl: TileLayer = el;
      if (tl.options.id === HAZARD_LAYER_ID) {
        map.removeLayer(el);
      }
    }
  });

  if (!hazardUrlValue) return null;

  map.addLayer(new TileLayer(hazardUrlValue, HAZARD_LAYER_OPTIONS));
  return null;
}
