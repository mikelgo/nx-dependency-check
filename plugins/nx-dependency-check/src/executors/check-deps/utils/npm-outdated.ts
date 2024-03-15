import { exec } from 'child_process';

export interface NpmOutdatedResult {
  // '@angular/core': NpmOutdatedVersionInfo
  [packageName: string]: NpmOutdatedVersionInfo;
}
export interface NpmOutdatedVersionInfo {
  current: string;
  wanted: string;
  latest: string;
  dependent: string;
  location: string;
}

export async function npmOutdated() {
  const r: NpmOutdatedResult = JSON.parse(await execAsync('npm outdated --json=true'));
  return r;
}
// https://github.com/npm/rfcs/issues/473#issuecomment-942645157
function execAsync(command): Promise<string> {
  return new Promise(function (resolve, reject) {
    exec(command, (error, stdout, stderr) => {
      if (stderr !== '') {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}
