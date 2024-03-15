interface VersionInfo {
  major: string;
  minor: string;
  patch: string;
}
export function parseVersion(versionString: string): VersionInfo | null {
  // remove ^ ~ > >= from string

  const cleanedVersion = versionString.replace('^', '').replace('~', '').replace('>=', '').replace('>', '');

  // write a regex which mateches the first occource in a string of folliwing characters ^ ~ >=

  const splitted = cleanedVersion.split('.');

  if (versionString === '*') {
    return null;
  }

  return {
    major: splitted[0],
    minor: splitted[1],
    patch: splitted[2],
  };
}
