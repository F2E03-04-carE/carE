export function cdnThumb(url: string, w = 800) {
  if (!url) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${w}/`);
}
