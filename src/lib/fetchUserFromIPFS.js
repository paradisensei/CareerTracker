export default function (ipfs, hash) {
  return new Promise((resolve, reject) => {
    if (!hash) {
      resolve(null);
    }
    ipfs.files.get(hash, (err, files) => {
      const rawUser = files[0].content.toString();
      resolve(JSON.parse(rawUser));
    });
  });
}