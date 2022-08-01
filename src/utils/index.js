
export function getCompName(name) {
  return name.replaceAll(/(-|^)(.)/g, ($0, $1, $2) => $2.toUpperCase())
}
