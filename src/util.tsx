export function roundTo(num: number, dec: number) {
  const decc = Math.pow(10, dec)
  return Math.round(num * decc) / decc
}

export function getNumberColorClass(base: number, mod: number, className: string): string {
    if(mod > base) {
      return className + "--green"
    } else if (mod < base) {
      return className + "--red"
    } else {
      return ""
    }
  }