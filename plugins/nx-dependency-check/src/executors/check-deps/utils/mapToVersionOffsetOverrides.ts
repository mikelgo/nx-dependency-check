import { VersionOffset } from './compare-version';

export function mapToVersionOffsetOverrides(
  versionOffsetOverrides?: Array<{ packageName: string } & VersionOffset>
): Map<string, number | VersionOffset> {
  return new Map((versionOffsetOverrides ?? []).map((item) => [item.packageName, item]));
}
