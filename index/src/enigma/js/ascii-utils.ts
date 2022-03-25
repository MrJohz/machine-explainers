export function isAscii(char: string): boolean {
  const code = char.charCodeAt(0);
  if (code >= 65 && code <= 90) return true;
  if (code >= 97 && code <= 122) return true;

  return false;
}

export function asciiLength(text: string): number {
  let count = 0;
  for (const c of text) {
    if (isAscii(c)) count += 1;
  }

  return count;
}

export function getLastAsciiLetter(text: string, prevLetter: string): string {
  text = text.replace(prevLetter, "");
  for (let idx = text.length - 1; idx >= 0; idx--) {
    if (isAscii(text[idx])) {
      return text[idx].toUpperCase();
    }
  }

  return prevLetter;
}

export function charToIndex(char: string): number | null {
  const code = char.charCodeAt(0);
  if (code >= 65 && code <= 90) return code - 65;
  if (code >= 97 && code <= 122) return code - 97;

  return null;
}

export function indexToChar(index: number): string {
  return String.fromCharCode(65 + (index % 26));
}
