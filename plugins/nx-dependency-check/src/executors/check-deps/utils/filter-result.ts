import { CompareVersionResult } from './compare-version';

export function filterResult(params: { result: Array<CompareVersionResult> }): Array<CompareVersionResult> {
  if (!params.result) {
    return [];
  }

  /**
   * We only want to return those packages which needs to be updated
   */

  const filteredResult = params.result.filter(
    (result) => result.result.major.needsUpdate || result.result.minor.needsUpdate || result.result.patch.needsUpdate
  );

  // sort by major needsupdate then minor then patch and within the groups by package name
  return filteredResult.sort((a, b) => {
    if (a.result.major.needsUpdate !== b.result.major.needsUpdate) {
      return a.result.major.needsUpdate ? -1 : 1;
    }
    if (a.result.minor.needsUpdate !== b.result.minor.needsUpdate) {
      return a.result.minor.needsUpdate ? -1 : 1;
    }
    if (a.result.patch.needsUpdate !== b.result.patch.needsUpdate) {
      return a.result.patch.needsUpdate ? -1 : 1;
    }
    return a.packageName.localeCompare(b.packageName);
  });
}
