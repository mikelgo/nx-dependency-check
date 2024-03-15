import { mapToVersionOffsetOverrides } from './mapToVersionOffsetOverrides';

describe(mapToVersionOffsetOverrides.name, () => {
  it('should map to Map<string, number | VersionOffset>', () => {
    const result = mapToVersionOffsetOverrides([
      {
        packageName: 'a',
        major: 1,
        minor: 1,
        patch: 5,
      },
      {
        packageName: 'b',
        major: 3,
      },
    ]);

    expect(result.get('a')).toEqual({ packageName: 'a', major: 1, minor: 1, patch: 5 });
    expect(result.get('b')).toEqual({ packageName: 'b', major: 3 });
  });
  it('should return a empty Map if arg is undefined', () => {
    expect(mapToVersionOffsetOverrides(undefined)).toEqual(new Map());
  });
});
