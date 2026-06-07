
export function appendScript(
  src: string,
  opts: { async?: boolean; defer?: boolean } = {},
  onload?: () => void,
) {
  const s = document.createElement("script");
  s.src = src;
  if (opts.async) s.async = true;
  if (opts.defer) s.defer = true;
  if (onload) s.onload = onload;
  document.head.appendChild(s);
  return s;
}