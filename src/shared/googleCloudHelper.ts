import { Storage } from '@google-cloud/storage';
import config from 'config';
import path from 'path';

const DEFF_IMG = 'english-for-kids/default.jpg';

const storage = new Storage({
  keyFilename: path.join(__dirname, `${config.get('cloudConf.key')}`)
});

const bucket = storage.bucket(config.get('cloudConf.bucket'));

export const uploadBlobFileData = async (fileData: { filename: string, data: string }): Promise<string> => {
  const { filename, data } = fileData;
  let pathToFile = DEFF_IMG;

  try {
    const file = bucket.file(filename);
    const stream = file.createWriteStream();
    const promise = new Promise((res, rej) => {
      stream.write(data);
      stream.on('finish', () => {
        pathToFile = `${bucket.name}/${file.name}`;
        res(pathToFile);
      });
      stream.on('error', rej);
      stream.end();
    });

    await promise;

    return pathToFile;
  } catch (e) {
    console.log(e);
    return DEFF_IMG;
  }
};
