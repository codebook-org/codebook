export async function toClipboard(text) {
  if (!text) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true; // if copy is successful
  } catch {
    return false;
  }
}
