import { join } from 'path';
import * as mockFs from 'mock-fs';
import { Hasher } from './hasher';

describe('Hasher', () => {
  it('sollte den korrekten Hash ermitteln', () => {
    // GIVEN
    mockFs({
      [join('/root', 'backend', 'libs', 'core')]: {
        'one.txt': 'first file',
        'two.txt': 'second file',
        'empty-dir': {},
        'another-dir': {
          'another.txt': 'more files',
        },
      },
    });

    // WHEN
    const actual = new Hasher('/root').getHash([
      join('backend', 'libs', 'core'),
    ]);

    // THEN
    expect(actual.digest('hex')).toEqual(
      '7761fb26ab4b71bc4f315c5fb461b20d6f6eab658d4e2998570c555edaa15af9'
    );
  });

  afterEach(() => {
    mockFs.restore();
  });
});
