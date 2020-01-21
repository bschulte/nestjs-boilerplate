import * as cp from 'child_process';
import * as fs from 'fs';
import { exec as pkgExec } from 'pkg';

const build = async () => {
  console.log('Building app');

  // Build the app
  cp.execSync('npm run build');

  // Create the binaries
  process.chdir('dist');
  console.log('Running pkg in directory:', process.cwd());
  await pkgExec(['src/main.js']);
  process.chdir('..');

  fs.renameSync('./dist/main-linux', './dist/nest-linux');
  fs.renameSync('./dist/main-macos', './dist/nest-mac');
  fs.renameSync('./dist/main-win.exe', './dist/nest-win.exe');

  console.log('Built binaries!');

  process.exit();
};

build();
