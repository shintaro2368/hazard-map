import { useAtomValue, useSetAtom } from "jotai";
import {
  BASE_MAP,
  HAZARD_KOZUI,
  HAZARD_NAISUI,
  HAZARD_TAKASHIO,
  HAZARD_THUNAMI,
  LS_ADDRESSES,
  OVERE_VIEW_MAP,
  WHITE_MAP,
} from "../lib/constants";
import {
  addressesAtom,
  currentCenterAtom,
  hazardUrlAtom,
  mapUrlAtom,
} from "../lib/global-state";
import { Area, MapInfo } from "../types";
import AddressSearch from "./AddressSearch";

/**
 * 地図やレイヤーの切り替え、エリアの管理を行うサイドバー
 * @returns
 */
export default function SideBar() {
  const addressesValue = useAtomValue(addressesAtom);
  const setAddresses = useSetAtom(addressesAtom);
  const setMapUrl = useSetAtom(mapUrlAtom);
  const setHazardUrl = useSetAtom(hazardUrlAtom);
  const setCurrentCenter = useSetAtom(currentCenterAtom);
  const currentCenterValue = useAtomValue(currentCenterAtom);

  // 地図種別
  const mapTypes: MapInfo[] = [BASE_MAP, OVERE_VIEW_MAP, WHITE_MAP];

  // 主要災害レイヤー種別
  const hazardTypes: MapInfo[] = [
    { NAME: "指定なし", TILE_URL: "" },
    HAZARD_KOZUI,
    HAZARD_TAKASHIO,
    HAZARD_THUNAMI,
    HAZARD_NAISUI,
  ];

  /**
   * IDからエリアをローカルストレージから削除する
   * @param id エリアID
   * @returns
   */
  function handleDelete(id: string) {
    try {
      const addressesStr = localStorage.getItem(LS_ADDRESSES);
      if (!addressesStr) {
        alert("ローカルストレージにデータがありません。");
        return;
      }

      const addresses: Area[] = JSON.parse(addressesStr);
      const removed = addresses.filter((address) => address.id !== id);
      localStorage.setItem(LS_ADDRESSES, JSON.stringify(removed));

      setAddresses(removed);
    } catch (e) {
      console.error(e);
      alert(
        "エリアの削除が失敗しました。ローカルストレージをクリアしてください。"
      );
    }
  }

  return (
    <div style={{ width: "400px" }} className="p-2">
      <h2 style={{ textAlign: "center" }} className="mb-4">
        防災ハザードマップ
      </h2>
      <h4 className="mb-2">エリア作成</h4>
      <AddressSearch />
      <h4 className="mb-2 mt-4">地図選択</h4>
      <div>
        {mapTypes.map((mapType) => (
          <div className="form-check form-check-inline" key={mapType.NAME}>
            <input
              defaultChecked={mapType.NAME === BASE_MAP.NAME}
              className="form-check-input"
              type="radio"
              name="maTypeOptions"
              id={mapType.NAME}
              value={mapType.TILE_URL}
              onChange={(e) => setMapUrl(e.target.value)}
            />
            <label className="form-check-label" htmlFor={mapType.NAME}>
              {mapType.NAME}
            </label>
          </div>
        ))}
      </div>
      <h4 className="mb-2 mt-4">ハザードマップ選択</h4>
      <div>
        {hazardTypes.map((hazardType, index) => (
          <div className="form-check form-check-inline" key={hazardType.NAME}>
            <input
              className="form-check-input"
              type="radio"
              defaultChecked={index === 0}
              name="hazardTypeOptions"
              id={hazardType.NAME}
              value={hazardType.TILE_URL}
              onChange={(e) => setHazardUrl(e.target.value)}
            />
            <label className="form-check-label" htmlFor={hazardType.NAME}>
              {hazardType.NAME}
            </label>
          </div>
        ))}
      </div>
      <h4 className="mb-2 mt-4">作成したエリア</h4>
      <div>
        {addressesValue.length === 0 && <p>保存されたエリアはありません。</p>}
        <ul className="list-group">
          {addressesValue.map((address) => (
            <li
              role="button"
              key={address.id}
              className={`list-group-item ${
                currentCenterValue.id === address.id
                  ? "bg-success text-white"
                  : ""
              }`}
              onClick={() => {
                setCurrentCenter({
                  id: address.id,
                  lat: address.lat,
                  lng: address.lng,
                });
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <p className="mb-0">{address.name}</p>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(address.id)}
                >
                  削除
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
