import { parseVersion } from './parse-version';

describe(parseVersion.name, () => {
  const sampleVersions = [
    '1.2.2',
    '^1.2.2',
    '~1.2.2',
    // any version
    '*',
    '>1.2.2',
  ];

  const cases = [
    { version: '1.2.2', expected: '1' },
    { version: '^1.2.2', expected: '1' },
    { version: '~1.2.2', expected: '1' },
    { version: '>1.2.2', expected: '1' },
  ];
  for (const t of cases) {
    it(`should parse ${t.version} and return ${t.expected}`, () => {
      expect(parseVersion(t.version).major).toEqual(t.expected);
    });
  }
  it('should return null for version *', () => {
    expect(parseVersion('*')).toEqual(null);
  });
});
