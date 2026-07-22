export function splitRouteName(name: string): { origin: string; destination: string } {
  const parts = name.split(" - ").map((p) => p.trim());
  return {
    origin: parts[0] ?? name,
    destination: parts[parts.length - 1] ?? name,
  };
}
