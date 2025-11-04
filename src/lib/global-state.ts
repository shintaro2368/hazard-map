import { atom } from "jotai";
import { BASE_MAP } from "./constants";
import { Area, CurrentCenter } from "./types";

export const currentCenterAtom = atom<CurrentCenter>({
  lat: 36,
  lng: 138,
});
export const addressesAtom = atom<Area[]>([]);
export const mapUrlAtom = atom<string>(BASE_MAP.TILE_URL);
export const hazardUrlAtom = atom<string | null>(null);
