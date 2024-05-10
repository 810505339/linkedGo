function blobToBase64(blob: Blob) {
  return new Promise<string | ArrayBuffer>((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      resolve(e.target!.result);
    };
    // readAsDataURL
    fileReader.readAsDataURL(blob);
    fileReader.onerror = () => {
      reject(new Error('文件流异常'));
    };
  });
}

export {
  blobToBase64,
};
