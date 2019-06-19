import { sync } from 'glob';

const fileNames = ['runtime', 'vendors', 'app'];
const dest = 'dist';

const getPath = () => fileNames.reduce((arr: Array<string>, name: string): Array<string> => {
  const files = sync(`dist/${name}.?(*.)js`, {
    dot: true,
    matchBase: true,
  });

  if (files && files.length) {
    const [fileRelativePath] = files;
    arr.push(fileRelativePath.replace(new RegExp(`^\\/?${dest}\\/?`), './'));
  }
  return arr;
}, []);

export default getPath;
