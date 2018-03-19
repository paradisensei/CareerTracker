export const fetchUserFromIPFS = (ipfs, hash) => {
  return new Promise((resolve, reject) => {
    ipfs.files.get(hash, (err, files) => {
      if (err || !files) {
        reject(err)
      }
      const rawUser = files[0].content.toString();
      resolve(JSON.parse(rawUser));
    });
  });
};

export const saveBufToIPFS = (buf, ipfs) => {
  return new Promise((resolve, reject) => {
    ipfs.files.add(buf, (err, files) => {
      if (err || !files) {
        reject(err);
      } else {
        resolve(files[0].hash);
      }
    });
  });
};

export const fetchOfferFromIPFS = (hash, secret, ipfs) => {
  return new Promise((resolve, reject) => {
    ipfs.files.get(hash, (err, files) => {
      if (err || !files) {
        reject(err)
      }
      if (secret) {
        resolve(files[0].content.toString('hex'));
      } else {
        resolve(JSON.parse(files[0].content.toString()));
      }
    });
  });
};