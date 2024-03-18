import { CheckDepsExecutorSchema } from './schema';
import { ExecutorContext } from '@nx/devkit';

import { CompareVersionResult, compareVersions, VersionOffset } from './utils/compare-version';
import { npmOutdated, NpmOutdatedVersionInfo } from './utils/npm-outdated';
import { mapToVersionOffsetOverrides } from './utils/mapToVersionOffsetOverrides';
import { filterResult } from './utils/filter-result';
import * as chalk from 'chalk';

import * as ora from 'ora-classic';

export type VersionOffSetMajorRequired = VersionOffset & {
  major: number;
};

export type PackageName = string;

interface CliOptions {
  isVerbose: boolean;
}
export default async function runExecutor(options: CheckDepsExecutorSchema, context: ExecutorContext) {
  const cliOptions: CliOptions = {
    isVerbose: context.isVerbose,
  };

  const spinner = ora('Analyzing dependencies').start();

  if (cliOptions.isVerbose) {
    console.log('Executor ran for VerifyPackageVersions', options);
  }
  const failOnVersionMismatch = options.failOnVersionMismatch ?? true;
  const dependenciesToCheck = options.dependenciesToCheck ?? ['*'];
  const maxVersionOffset: VersionOffSetMajorRequired = options.versionOffset ?? {
    major: 1,
  };
  const versionOffsetOverrides = mapToVersionOffsetOverrides(options.versionOffsetOverrides);

  validateOptions({ dependenciesToCheck, maxVersionOffset });

  const r = await npmOutdated();
  const installedDependenciesMap = new Map<PackageName, NpmOutdatedVersionInfo>(Object.entries(r));

  const result = await checkVersions({
    packageNames: dependenciesToCheck,
    installedDependencies: installedDependenciesMap,
    maxVersionOffset,
    versionOffsetOverrides: versionOffsetOverrides,
    cliOptions,
  });

  printSummary({
    result,
    projectName: context.projectName,
  });
  if (!failOnVersionMismatch && result.length > 0) {
    console.log(
      chalk.blue(
        `Some packages are behind the expected version numbers. Exiting with success because executor option failOnVersionMismatch is set to false.`
      )
    );
  }
  spinner.stop();
  return {
    success: failOnVersionMismatch ? result.length === 0 : true,
  };
}

async function checkVersions(params: {
  packageNames: string[];
  installedDependencies: Map<PackageName, NpmOutdatedVersionInfo>;
  maxVersionOffset: VersionOffSetMajorRequired;
  versionOffsetOverrides: Map<string, number | VersionOffset>;
  cliOptions: CliOptions;
}): Promise<Array<CompareVersionResult>> {
  // todo in case of null Promise reject. Guess i need to wrap the whole thing with new promise
  let result: Array<CompareVersionResult> = [];
  if (params.packageNames.length === 1 && params.packageNames.includes('*')) {
    console.log('Wildcard detected. Checking all dependencies.');
    for (const dependency of params.installedDependencies) {
      const packageName = dependency[0];
      const installedDependency = dependency[1];
      if (!packageName || !installedDependency) {
        throw new Error('packageName or dependency not defined. This should not happen');
      }

      result.push(...doPackageComparison({
        installedDependency,
        packageName,
        maxVersionOffset: params.maxVersionOffset,
        versionOffsetOverrides: params.versionOffsetOverrides,
      }));
    }
  }

  if (!params.packageNames.includes('*')) {
    if (params.cliOptions.isVerbose) {
      console.log('Checking versions for provided packages\n');
      console.log(`packages: ${params.packageNames.join('\n')}`);
    }

    for (const packageName of params.packageNames) {
      const installedDependency = params.installedDependencies.get(packageName);
      if (!installedDependency) {
        if (params.cliOptions.isVerbose) {
          console.log(`package ${packageName} needs no check according to npm outdated`);
        }
        // continue iteration
        continue;
      }

      result.push(...doPackageComparison({
        installedDependency,
        maxVersionOffset: params.maxVersionOffset,
        versionOffsetOverrides: params.versionOffsetOverrides,
        packageName,
      }));
    }
  }

  return filterResult({ result });
}

function doPackageComparison(params: {
  packageName: PackageName;
  installedDependency: NpmOutdatedVersionInfo;
  maxVersionOffset: VersionOffSetMajorRequired;
  versionOffsetOverrides: Map<string, number | VersionOffset>;
}) {
  const result: Array<CompareVersionResult> = [];
  const latestVersion = params.installedDependency.latest;
  const installedVersion = params.installedDependency.current;
  let versionOffset: VersionOffset = {
    major: params.maxVersionOffset.major,
    minor: null,
    patch: null,
  };
  const versionOffsetOverride = params.versionOffsetOverrides.get(params.packageName);
  if (versionOffsetOverride) {
    versionOffset = {
      ...versionOffset,
      /**
       * Todo
       * if i want to support version-checkign also on minors and patches here is the place to update the
       * implementation
       */
      major:
        typeof versionOffsetOverride === 'number'
          ? versionOffsetOverride
          : versionOffsetOverride.major ?? params.maxVersionOffset.major,
      minor: typeof versionOffsetOverride !== 'number' ? versionOffsetOverride.minor : undefined,
      patch: typeof versionOffsetOverride !== 'number' ? versionOffsetOverride.patch : undefined,
    };
  }

  result.push(
    compareVersions({
      packageName: params.packageName,
      first: installedVersion,
      second: latestVersion,
      maxDifference: versionOffset,
    })
  );

  return result;
}

function validateOptions(params: { dependenciesToCheck: string[]; maxVersionOffset: VersionOffSetMajorRequired }) {
  if (params.dependenciesToCheck.length === 0) {
    throw new Error(
      'You must provide at least one package name to check or use wildcard (*) to check all dependencies'
    );
  }
  if (params.dependenciesToCheck.includes('*') && params.dependenciesToCheck.length !== 1) {
    throw new Error('You cannot provide other package names when using the wildcard (*)');
  }
}

function printSummary(params: { result: Array<CompareVersionResult>; projectName: string }) {
  if (params.result.length === 0) {
    console.log('All packages match the expected version numbers. No update needed.');
    return;
  }

  console.log(chalk.bold.blue(`\nSummary for project ${params.projectName}\n`));
  console.log('Following packages need to be updated\n');

  const printableResult = params.result.map((r) => ({
    'package name': r.packageName,
    'installed version': r.installedVersion,
    'latest version': r.latestVersion,
    'majors behind': r.result.major.isVersionNumbersBehind,
    'minors behind': r.result.minor.isVersionNumbersBehind,
    'patches behind': r.result.patch.isVersionNumbersBehind,
  }));

  console.table(printableResult);
}
