// FNV-1a 32-bit hash: tiny, dependency-free, and stable across separate JS
// runs, so a given seed hashes identically on the server and the client. That
// stability is what lets the Instagram tiles agree on an image with no
// post-hydration swap.
const FNV_OFFSET_BASIS = 0x811c9dc5;
const FNV_PRIME = 0x01000193;

export function hashString(seed: string): number {
  let hash = FNV_OFFSET_BASIS;
  for (let index = 0; index < seed.length; index++) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, FNV_PRIME);
  }
  // Coerce the signed Math.imul result to an unsigned 32-bit integer.
  return hash >>> 0;
}

export function pickDeterministicIndex(seed: string, length: number): number {
  if (length <= 0) {
    return 0;
  }
  return hashString(seed) % length;
}

export function pickDeterministicImage(
  images: string[] | undefined,
  seed: string,
): string | undefined {
  if (!images?.length) {
    return undefined;
  }
  return images[pickDeterministicIndex(seed, images.length)];
}
