// Importar CryptoJS
import CryptoJS from 'crypto-js'

// Clave secreta para encriptación y desencriptación
const secretKey = 'clave_secreta' // Usa una clave segura y mantenla oculta

// Encriptar los datos
export function encryptData(data = {}) {
  // Convertir el objeto a JSON y luego encriptarlo
  const jsonString = JSON.stringify(data)
  const encrypted = CryptoJS.AES.encrypt(jsonString, secretKey).toString()
  return encrypted
}

// Desencriptar los datos
export function decryptData(encryptedData = '') {
  // Desencriptar los datos
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey)
  const decrypted = bytes.toString(CryptoJS.enc.Utf8)
  return JSON.parse(decrypted) // Convertir de nuevo a objeto JSON
}
