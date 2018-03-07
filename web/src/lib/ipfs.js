export const fetchObjectFromIPFS = (ipfs, hash) => {
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

export const saveUserToIPFS = (user, ipfs) => {
  const userBuf = Buffer.from(JSON.stringify(user), 'utf8');

  return new Promise((resolve, reject) => {
    ipfs.files.add(userBuf, (err, files) => {
      if (err || !files) {
        reject(err);
      } else {
        resolve(files[0].hash);
      }
    });
  });
};