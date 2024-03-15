import { compareVersions } from './compare-version';

describe(compareVersions.name, () => {
  it('should work', () => {
    const packageName = 'a';

    const result = compareVersions({
      first: '1.0.5',
      second: '3.5.5',
      maxDifference: {
        major: 1,
        minor: 1,
        patch: 5,
      },
      packageName,
    });

    const extractedResult = result.result;

    expect(extractedResult.major.isOverMaxDiff).toEqual(true);
    expect(extractedResult.major.isVersionNumbersBehind).toEqual(2);
    expect(extractedResult.major.needsUpdate).toEqual(true);

    expect(extractedResult.minor.isOverMaxDiff).toEqual(true);
    expect(extractedResult.minor.isVersionNumbersBehind).toEqual(5);
    expect(extractedResult.minor.needsUpdate).toEqual(true);

    expect(extractedResult.patch.isOverMaxDiff).toEqual(false);
    expect(extractedResult.patch.isVersionNumbersBehind).toEqual(0);
    expect(extractedResult.patch.needsUpdate).toEqual(false);
  });
  it('should work', () => {
    const packageName = 'a';
    const result = compareVersions({
      first: '1.0.5',
      second: '3.5.5',
      maxDifference: {
        major: 1,
        minor: null,
        patch: null,
      },
      packageName,
    });
    const extractedResult = result.result;

    expect(extractedResult.major.isOverMaxDiff).toEqual(true);
    expect(extractedResult.major.isVersionNumbersBehind).toEqual(2);
    expect(extractedResult.major.needsUpdate).toEqual(true);

    expect(extractedResult.minor.isOverMaxDiff).toEqual(false);
    expect(extractedResult.minor.isVersionNumbersBehind).toEqual(5);
    expect(extractedResult.minor.needsUpdate).toEqual(false);

    expect(extractedResult.patch.isOverMaxDiff).toEqual(false);
    expect(extractedResult.patch.isVersionNumbersBehind).toEqual(0);
    expect(extractedResult.patch.needsUpdate).toEqual(false);
  });
});
