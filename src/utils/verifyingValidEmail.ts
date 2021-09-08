export function verifyingValidEmail(possibleEmail: string) {
  let regex = /\S+@\S+\.\S+/
  return regex.test(possibleEmail)
}
