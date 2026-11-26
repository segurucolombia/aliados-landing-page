const HOSTS_YOUTUBE = ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'];

/**
 * Id del video si el enlace es de YouTube (watch?v=, youtu.be, shorts, live o embed),
 * o null si no lo es. Misma regla que el backend y el admin.
 */
export function extraerIdYoutube(valor: string): string | null {
  let url: URL;
  try {
    url = new URL(valor.trim());
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
  const host = url.hostname.toLowerCase();
  const partes = url.pathname.split('/').filter(Boolean);
  let id: string | null | undefined = null;
  if (host === 'youtu.be' || host === 'www.youtu.be') id = partes[0];
  else if (HOSTS_YOUTUBE.includes(host)) {
    if (partes[0] === 'watch') id = url.searchParams.get('v');
    else if (['embed', 'shorts', 'live', 'v'].includes(partes[0])) id = partes[1];
  }
  return id && /^[\w-]{11}$/.test(id) ? id : null;
}
