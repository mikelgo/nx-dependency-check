import { parseVersion } from './parse-version';

export type VersionOffset = { major?: number; minor?: number; patch?: number | null };

export interface CompareVersionPackageInfo {
  isOverMaxDiff: boolean;
  isVersionNumbersBehind: number;
  needsUpdate: boolean;
}
export interface CompareVersionResult {
  installedVersion: string;
  latestVersion: string;
  packageName: string;
  result: {
    major: CompareVersionPackageInfo;
    minor: CompareVersionPackageInfo;
    patch: CompareVersionPackageInfo;
  };
}

function compareVersion(first: number, second: number, maxDifference: number | null) {
  let difference = second - first;
  if (difference < 0) {
    // means that the installed version is higher than expected version
    difference = 0;
  }

  return {
    inputs: {
      first,
      second,
      maxDifference,
    },
    result: {
      isOverMaxDiff: maxDifference ? difference > maxDifference : false,
      isVersionNumbersBehind: difference,
      // isVersionNumbersBehind:   maxDifference ? difference : 0
      needsUpdate: maxDifference ? difference > maxDifference : false,
    },
  };
}

export function compareVersions(params: {
  first: string;
  second: string;
  maxDifference: VersionOffset;
  packageName: string;
}): CompareVersionResult {
  const firstParsed = parseVersion(params.first);
  const secondParsed = parseVersion(params.second);

  if (!firstParsed || !secondParsed) {
    return null;
  }

  const majorResult = compareVersion(Number(firstParsed.major), Number(secondParsed.major), params.maxDifference.major);
  const minorResult = compareVersion(Number(firstParsed.minor), Number(secondParsed.minor), params.maxDifference.minor);
  const patchResult = compareVersion(Number(firstParsed.patch), Number(secondParsed.patch), params.maxDifference.patch);

  return {
    installedVersion: params.first,
    latestVersion: params.second,
    packageName: params.packageName,
    result: {
      major: {
        isOverMaxDiff: majorResult.result.isOverMaxDiff,
        isVersionNumbersBehind: majorResult.result.isVersionNumbersBehind,
        needsUpdate: majorResult.result.needsUpdate,
      },
      minor: {
        isOverMaxDiff: minorResult.result.isOverMaxDiff,
        isVersionNumbersBehind: minorResult.result.isVersionNumbersBehind,
        needsUpdate: minorResult.result.needsUpdate,
      },
      patch: {
        isOverMaxDiff: patchResult.result.isOverMaxDiff,
        isVersionNumbersBehind: patchResult.result.isVersionNumbersBehind,
        needsUpdate: patchResult.result.needsUpdate,
      },
    },
  };
}
