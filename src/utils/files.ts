import fs from "fs";

export const readFile = async (fullpath: string): Promise<Buffer> => {
  return new Promise(async (resolve, reject) => {
    await fs.readFile(fullpath, function (err, file) {
      if (err) {
        reject(err.message);
      }
      resolve(file);
    });
  });
};
