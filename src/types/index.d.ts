/**
 * 国土地理院ジオコーディングAPIレスポンスデータの型
 * 公式APIドキュメントが見たらなかったので、実際のレスポンス内容から型を推測している
 */
export type AddressSearchResult = {
  geometry: {
    /**
     * 入力された住所から求められた緯度経度 [lng, lat]
     */
    coordinates: [number, number];
    type: string;
  };
  type: string;
  properties: {
    addressCode: string;
    /**
     * 入力された住所
     */
    title: string;
  };
}[];

/**
 * エリア作成フォーム型
 */
export type AreaForm = {
  /**
   * 住所
   */
  address: string;
  /**
   * エリア名（勤務地周辺、別荘周辺 etc...）
   */
  name: string;
};

/**
 * エリア型
 */
export type Area = {
  /**
   * エリアの識別子
   */
  id: string;
  /**
   * エリア名
   */
  name: string;
  /**
   * 緯度
   */
  lat: number;
  /**
   * 経度
   */
  lng: number;
};

/**
 * 地図の中心座標
 */
export type CurrentCenter = {
  /**
   * エリアのID
   */
  id?: string;
  /**
   * 緯度
   */
  lat: number;
  /**
   * 経度
   */
  lng: number;
};

/**
 * 地図
 */
export type MapInfo = {
  /**
   * 地図の名称
   */
  NAME: string;
  /**
   * 地図（マップ）タイルのURL
   */
  TILE_URL: string;
};
