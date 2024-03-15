import { CompareVersionResult } from './compare-version';
import { filterResult } from './filter-result';

describe(filterResult.name, () => {
  it('should return empty array if no package needs to be updated', () => {
    const packageA: CompareVersionResult = {
      packageName: 'a',
      installedVersion: '1.0.5',
      latestVersion: '1.1.6',
      result: {
        major: {
          isOverMaxDiff: false,
          isVersionNumbersBehind: 0,
          needsUpdate: false,
        },
        minor: {
          isOverMaxDiff: false,
          isVersionNumbersBehind: 1,
          needsUpdate: false,
        },
        patch: {
          isOverMaxDiff: false,
          isVersionNumbersBehind: 1,
          needsUpdate: false,
        },
      },
    };
    const packageB: CompareVersionResult = {
      packageName: 'b',
      installedVersion: '1.0.5',
      latestVersion: '2.1.6',
      result: {
        major: {
          isOverMaxDiff: false,
          isVersionNumbersBehind: 1,
          needsUpdate: false,
        },
        minor: {
          isOverMaxDiff: false,
          isVersionNumbersBehind: 1,
          needsUpdate: false,
        },
        patch: {
          isOverMaxDiff: false,
          isVersionNumbersBehind: 1,
          needsUpdate: false,
        },
      },
    };
    const input: Array<CompareVersionResult> = [packageA, packageB];

    expect(filterResult({ result: input })).toEqual([]);
  });
  it('should only return those packages which needs to be updated', () => {
    const packageA: CompareVersionResult = {
      packageName: 'a',
      installedVersion: '1.0.5',
      latestVersion: '1.1.6',
      result: {
        major: {
          isOverMaxDiff: false,
          isVersionNumbersBehind: 0,
          needsUpdate: false,
        },
        minor: {
          isOverMaxDiff: false,
          isVersionNumbersBehind: 1,
          needsUpdate: false,
        },
        patch: {
          isOverMaxDiff: false,
          isVersionNumbersBehind: 1,
          needsUpdate: false,
        },
      },
    };
    const packageB: CompareVersionResult = {
      packageName: 'b',
      installedVersion: '1.0.5',
      latestVersion: '2.1.6',
      result: {
        major: {
          isOverMaxDiff: false,
          isVersionNumbersBehind: 1,
          needsUpdate: false,
        },
        minor: {
          isOverMaxDiff: false,
          isVersionNumbersBehind: 1,
          needsUpdate: false,
        },
        patch: {
          isOverMaxDiff: false,
          isVersionNumbersBehind: 1,
          needsUpdate: false,
        },
      },
    };
    const needsUpdate1: CompareVersionResult = {
      packageName: 'needsUpdate1',
      installedVersion: '1.0.0',
      latestVersion: '3.0.0',
      result: {
        major: {
          isOverMaxDiff: true,
          isVersionNumbersBehind: 2,
          needsUpdate: true,
        },
        minor: {
          isOverMaxDiff: false,
          isVersionNumbersBehind: 0,
          needsUpdate: false,
        },
        patch: {
          isOverMaxDiff: false,
          isVersionNumbersBehind: 0,
          needsUpdate: false,
        },
      },
    };
    const needsUpdate2: CompareVersionResult = {
      packageName: 'needsUpdate2',
      installedVersion: '1.0.0',
      latestVersion: '1.5.0',
      result: {
        major: {
          isOverMaxDiff: false,
          isVersionNumbersBehind: 0,
          needsUpdate: false,
        },
        minor: {
          isOverMaxDiff: true,
          isVersionNumbersBehind: 5,
          needsUpdate: true,
        },
        patch: {
          isOverMaxDiff: false,
          isVersionNumbersBehind: 0,
          needsUpdate: false,
        },
      },
    };
    const input: Array<CompareVersionResult> = [packageA, needsUpdate1, needsUpdate2, packageB];

    const expectedResult: Array<CompareVersionResult> = [needsUpdate1, needsUpdate2];

    expect(filterResult({ result: input })).toEqual(expectedResult);
  });
});
