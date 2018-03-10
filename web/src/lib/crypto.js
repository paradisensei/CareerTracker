import ecies from 'bitcore-ecies';
import bitcore from 'bitcore-ecies/node_modules/bitcore-lib';

export const encrypt = (privateKey, publicKey, msg) => {
  const me = getEcies(privateKey, publicKey);
  return me.encrypt(msg).toString('hex');
};

export const decrypt = (privateKey, publicKey, msg) => {
  const me = getEcies(privateKey, publicKey);
  return me.decrypt(new Buffer(msg, 'hex')).toString();
};

function getEcies(privateKey, publicKey) {
  return ecies()
    .privateKey(new bitcore.PrivateKey(privateKey))
    .publicKey(new bitcore.PublicKey('04' + publicKey.slice(2)));
}