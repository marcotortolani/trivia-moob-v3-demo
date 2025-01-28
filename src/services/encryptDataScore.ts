import RC4Class from 'rc4-ts'

const encrypKey = 'MoobgamingAJM'
const rc4 = new RC4Class(encrypKey)

export function encryptDataScore({
  gameHash,
  userHash,
  partialScore,
}: {
  gameHash: string
  userHash: string
  partialScore: number
}) {
  const dataEncrypted: string =
    rc4.encrypt(`${gameHash}-${userHash}-${partialScore}`) || ''
  const transactionID = rc4.encrypt(
    Math.floor(10000 + Math.random() * 90000).toString()
  )
  const validationNumber = sumCharacters(dataEncrypted + transactionID)

  return `${dataEncrypted}-${transactionID}-${validationNumber}`
}

function sumCharacters(str: string) {
  return str.split('').reduce((suma, char) => suma + parseInt(char, 16) || 0, 0)
}
