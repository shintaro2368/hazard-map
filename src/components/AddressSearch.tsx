import { useSetAtom } from "jotai";
import { useState } from "react";
import { LS_ADDRESSES, SEARCH_API } from "../lib/constants";
import { addressesAtom, currentCenterAtom } from "../lib/global-state";
import { AddressSearchResult, Area, AreaForm } from "../types";

export default function AddressSearch() {
  const initialAreaForm: AreaForm = {
    address: "",
    name: "",
  };
  const [areaForm, setAreaForm] = useState<AreaForm>(initialAreaForm);

  // ジオコーディングを取得中かの判定
  const [isSeach, setIsSearch] = useState(false);

  // エリア名入力ダイアログを表示するかの判定
  const [showDialog, setShowDialog] = useState(false);

  const setAddresses = useSetAtom(addressesAtom);
  const setCurrentCenter = useSetAtom(currentCenterAtom);

  /**
   * 国土地理院ジオコーディングAPIを呼び出して、返却された緯度経度とエリア名を紐づけて保存する
   */
  async function handleSearchAndSave() {
    setIsSearch(true);
    try {
      const res = await fetch(`${SEARCH_API}${areaForm.address}`);

      if (!res.ok) {
        throw new Error(`Http error was occurred with stats ${res.status}.`);
      }
      const data: AddressSearchResult = await res.json();

      // ヒットしなければ空配列である
      if (data.length === 0) {
        alert(
          "住所から緯度経度を検索することができませんでした。\n入力内容をご確認ください。"
        );
      } // 住所が抽象的であれば複数件ヒットすることがある
      else if (data.length >= 2) {
        alert(
          "複数件の住所が候補としてあります。\n特定が可能な住所を具体的に入力してください。"
        );
      } else {
        const coordinates = data[0].geometry.coordinates;
        const newArea: Area = {
          id: crypto.randomUUID(),
          name: areaForm.name,
          lat: coordinates[1],
          lng: coordinates[0],
        };

        const addressFromLS = localStorage.getItem(LS_ADDRESSES);
        const areas: Area[] = [];
        try {
          if (addressFromLS) {
            areas.push(JSON.parse(addressFromLS));
          }
          areas.push(newArea);
          localStorage.setItem(LS_ADDRESSES, JSON.stringify(areas));
        } catch (e) {
          console.error(e);
          alert(
            "エリアの保存に失敗しました。\nローカルストレージをクリアしてください。"
          );
          return;
        }

        setAddresses((prev) => [...prev, newArea]);
        setCurrentCenter({
          id: newArea.id,
          lat: newArea.lat,
          lng: newArea.lng,
        });
      }
    } catch (e) {
      console.error(e);
      alert("エリア作成に失敗しました");
    } finally {
      setIsSearch(false);
      setShowDialog(false);
      setAreaForm(initialAreaForm);
    }
  }

  return (
    <>
      <div className="d-flex m-2">
        <input
          className="form-control me-2"
          type="text"
          required
          value={areaForm.address}
          onChange={(e) =>
            setAreaForm((prev) => ({ ...prev, address: e.target.value }))
          }
          placeholder="住所を入力"
        />
        <button
          className={`w-25 btn btn-primary ${isSeach ? "disabled" : ""}`}
          onClick={() => setShowDialog(true)}
        >
          追加
        </button>
      </div>
      {isSeach && <p>位置情報を取得中...</p>}
      {showDialog && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">エリア作成</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setAreaForm(initialAreaForm);
                    setShowDialog(false);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p>エリアの名前を入力してください。</p>
                <input
                  type="text"
                  className="form-control"
                  value={areaForm.name}
                  onChange={(e) =>
                    setAreaForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  ref={(ie) => ie?.focus()}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setAreaForm(initialAreaForm);
                    setShowDialog(false);
                  }}
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  className={`btn btn-primary ${isSeach ? "disabled" : ""}`}
                  onClick={() => handleSearchAndSave()}
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
