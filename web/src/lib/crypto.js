import ecies from 'bitcore-ecies';
import bitcore from 'bitcore-ecies/node_modules/bitcore-lib';

export const encrypt = (privateKey, publicKey, msg) => {
  const me = ecies()
    .privateKey(new bitcore.PrivateKey(privateKey))
    .publicKey(new bitcore.PublicKey('04' + publicKey.slice(2)));
  return me.encrypt(msg);
};