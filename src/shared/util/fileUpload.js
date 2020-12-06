export const onFileUpload = (fileInfo) => {
  return new Promise((resolve, reject) => {
    const fileName = String(new Date().getTime()).concat(
      fileInfo.name && fileInfo.name.replace(/ /g, "_")
    );

    const bodyRes = {
      name: fileName,
      type: fileInfo.type
    };
    var reader = new FileReader();
    reader.addEventListener('loadend', (e) => {
      fetch(
        "https://jpizbv7oxh.execute-api.us-east-1.amazonaws.com/dev/requestUploadURL",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(bodyRes)
        }
      )
        .then(response => response.json())
        .then(json => {
          return fetch(json.uploadURL, {
            method: "PUT",
            body: new Blob([reader.result], { type: fileInfo.type })
          });
        })
        .then(result => {
          if (result.status === 200) {
            const url = `https://mom-asset.s3.amazonaws.com/${fileName}`;
            resolve(url);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
    reader.readAsArrayBuffer(fileInfo);
  });
};