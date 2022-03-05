export function letterToRotation(letter: string): number {
  const position = letter.toUpperCase().charCodeAt(0) - 65;
  if (position < 0 || position > 25) {
    throw new Error("inputted letters must be between A-Z or a-z");
  }

  return position;
}

export function rotationToLetter(position: number): string {
  if (position < 0 || position > 25) {
    throw new Error("inputted positions must be between 0 and 25 inclusive");
  }

  return String.fromCharCode(position + 65);
}
