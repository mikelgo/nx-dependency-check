import { createHash, Hash } from 'crypto';
import { existsSync, lstatSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';

export class Hasher {
  constructor(
    private readonly basePath: string,
    private readonly algorithm: 'sha1' | 'sha256' = 'sha256'
  ) {}

  getHash(
    path: string | Array<string>,
    hash = createHash(this.algorithm)
  ): Hash {
    if (Array.isArray(path)) {
      return path
        .map((p) => (existsSync(p) ? p : join(this.basePath, p)))
        .reduce((h, p) => this.getHash(p, h), hash);
    }

    if (!existsSync(path)) {
      throw new Error(
        `Checksum-Generation: The given path '${path}' does not exist`
      );
    }

    if (lstatSync(path).isFile()) {
      return hash.update(readFileSync(path));
    }

    const files = readdirSync(path);

    for (const file of files) {
      // eslint-disable-next-line no-param-reassign
      hash = this.getHash(join(path, file), hash);
    }

    return hash;
  }
}
