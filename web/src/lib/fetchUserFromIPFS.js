export default function (ipfs, hash) {
  return new Promise((resolve, reject) => {
    ipfs.files.get(hash, (err, files) => {
      if (err) {
        reject(err)
      }
      const rawUser = files[0].content.toString();
      resolve(JSON.parse(rawUser));
    });
  });
}