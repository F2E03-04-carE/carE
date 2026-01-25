/**
 * 距離計算工具函數
 * 使用 Haversine 公式計算兩個經緯度座標之間的距離
 */

/**
 * 計算兩個經緯度座標之間的距離（公里）
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // 地球半徑（公里）

  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // 保留一位小數
}

/**
 * 將角度轉換為弧度
 */
function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * 取得使用者當前位置（經緯度）
 */
export function getUserLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('你的瀏覽器不支援定位功能'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        let errorMessage = '無法取得位置';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '使用者拒絕定位請求';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = '位置資訊無法取得';
            break;
          case error.TIMEOUT:
            errorMessage = '定位請求逾時';
            break;
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });
}

/**
 * 預設的台北市中心座標（當無法取得使用者位置時使用）
 */
export const DEFAULT_LOCATION = {
  lat: 25.0330,
  lng: 121.5654,
};
