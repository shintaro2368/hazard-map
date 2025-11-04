import { useAtomValue } from "jotai";
import {
  HAZARD_NAISUI,
  HAZARD_REFERENCE,
  HAZARD_TITLE,
} from "../lib/constants";
import { hazardUrlAtom } from "../lib/global-state";

/**
 * 主要災害レイヤーの凡例を表示する
 * @returns
 */
export default function HazardLegend() {
  const hazardUrlValue = useAtomValue(hazardUrlAtom);

  if (!hazardUrlValue) return null;

  return (
    <div
      className="position-absolute bg-white p-2 rounded d-flex flex-column align-items-center"
      style={{ zIndex: 999, bottom: 20, right: 20 }}
    >
      <p className="mb-1">凡例</p>
      <img
        src={
          hazardUrlValue === HAZARD_NAISUI.TILE_URL
            ? "./naisui_legend.png"
            : "./but_naisui_legend.png"
        }
        width={200}
        height={223}
        alt="ハザードマップの凡例画像"
      />
      <div>
        <span className="fs-6">
          出典:{" "}
          <a target="_blank" href={HAZARD_REFERENCE}>
            {HAZARD_TITLE}
          </a>
        </span>
      </div>
    </div>
  );
}
