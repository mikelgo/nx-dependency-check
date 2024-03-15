import { CompareVersionResult } from './compare-version';

export function filterResult(params: { result: Array<CompareVersionResult> }): Array<CompareVersionResult> {
  if (!params.result) {
    return [];
  }

  /**
   * We only want to return those packages which needs to be updated
   */

  return params.result.filter(
    (result) => result.result.major.needsUpdate || result.result.minor.needsUpdate || result.result.patch.needsUpdate
  );
}
