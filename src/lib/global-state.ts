import { atom } from "jotai";
import { Area, CurrentCenter } from "../types";
import { BASE_MAP, INITIAL_CENTER_POINT } from "./constants";

export const currentCenterAtom = atom<CurrentCenter>(INITIAL_CENTER_POINT);
export const addressesAtom = atom<Area[]>([]);
export const mapUrlAtom = atom<string>(BASE_MAP.TILE_URL);
export const hazardUrlAtom = atom<string | null>(null);
