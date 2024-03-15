export interface CheckDepsExecutorSchema {
  /**
   * The list of dependencies to check
   *
   * @default ['*'] - all dependencies will be checked
   *
   * @example
   *
   * ['@angular/core', '@angular/common', 'rxjs']
   */
  dependenciesToCheck?: string[];
  /**
   * The maximum version offset for each dependency
   *
   * @default { major: 1 }
   */
  versionOffset?: VersionOffSetMajorRequired;

  /**
   * Possible overrides to the specified versionOffset for specific dependencies.
   *
   * @example
   *    @angular/core can be at maximum 2 major version behind the latest major version.
   *   ['@angular/core', 2],
   *   rxjs can be at maximum 2 major version behind the latest major version.
   *   ['rxjs', { major: 2, }],
   */
  versionOffsetOverrides?: Array<{ packageName: string } & VersionOffset>;
  /**
   * If true, the executor will fail if a version mismatch is found.
   *
   * Setting this to false is useful if you do not e.g. want to fail the CI build if a version mismatch is found but
   * still want to get the result of the version check.
   * @default true
   */
  failOnVersionMismatch?: boolean;
} // eslint-disable-line
