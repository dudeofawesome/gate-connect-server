import { DateTime } from 'luxon';

export function DateTimeToString(
  val: DateTime | undefined,
): string | undefined {
  return val ? val.toISO() : undefined;
}

