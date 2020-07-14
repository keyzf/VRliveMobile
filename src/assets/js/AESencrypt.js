
/* jshint esversion: 6 */
/* jshint esversion: 8 */
const crypto = require('crypto');
export default {
  aesEncrypt (word, keyOne) {
    let key = crypto.enc.Hex.parse(keyOne);
    let enc = '';
    if (typeof word === 'string') {
      enc = crypto.AES.encrypt(word, key, {
        // iv: iv
        mode: crypto.mode.ECB,
        padding: crypto.pad.Pkcs7
      })
    } else if (typeof word === 'object') {
      enc = crypto.AES.encrypt(data, key, {
        // iv: iv
        mode: crypto.mode.CBC,
        padding: crypto.pad.Pkcs7
      })
    }
    console.log(enc)
    let encResult = enc.ciphertext.toString()
    return encResult;
  },
  encryptText (keyStr, text) {
    const algorithm = 'aes-256-cfb'
    const hash = crypto.createHash('sha256');
    hash.update(keyStr);
    const keyBytes = hash.digest();
    const iv = crypto.randomBytes(16);
    console.log(iv)
    const cipher = crypto.createCipheriv(algorithm, keyBytes, iv);
    let enc = [iv, cipher.update(text, 'utf8')];
    enc.push(cipher.final());
    return Buffer.concat(enc).toString('base64');
  },
  decryptText (keyStr, text) {
    const algorithm = 'aes-256-cfb'
    const hash = crypto.createHash('sha256');
    hash.update(keyStr);
    const keyBytes = hash.digest();

    const contents = Buffer.from(text, 'base64');
    const iv = contents.slice(0, 16);
    const textBytes = contents.slice(16);
    const decipher = crypto.createDecipheriv(algorithm, keyBytes, iv);
    let res = decipher.update(textBytes, '', 'utf8');
    res += decipher.final('utf8');
    return res;
  },

  aesDecrypt (word, keyOne) {
    let key = crypto.enc.Hex.parse(keyOne)
    let dec = crypto.AES.decrypt(crypto.format.Hex.parse(word), key, {
      // vi: vi
      mode: crypto.mode.ECB,
      padding: crypto.pad.Pkcs7
    });
    let decData = crypto.enc.Utf8.stringify(dec);
    return decData;
  }
};

