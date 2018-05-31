import ecies from 'bitcore-ecies';
import bitcore from 'bitcore-ecies/node_modules/bitcore-lib';

// encrypt msg using sender's private key and recipient's public key
export const encrypt = (privateKey, publicKey, msg) => {
  const me = getEcies(privateKey, publicKey);
  return me.encrypt(msg).toString('hex');
};

// decrypt msg using sender's public key and recipient's private key
export const decrypt = (privateKey, publicKey, msg) => {
  const me = getEcies(privateKey, publicKey);
  return me.decrypt(new Buffer(msg, 'hex')).toString();
};

// utility function
function getEcies(privateKey, publicKey) {
  return ecies()
    .privateKey(new bitcore.PrivateKey(privateKey))
    .publicKey(new bitcore.PublicKey('04' + publicKey.slice(2)));
}