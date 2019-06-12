import { ValueTransformer } from 'typeorm';
import { DateTime } from 'luxon';

export class TimestampTzTransformer implements ValueTransformer {
  to(value?: number | Date | DateTime): string | undefined {
    if (value == null) {
      return undefined;
    } else if (typeof value === 'number') {
      return new Date(value).toISOString();
    } else if (value instanceof Date) {
      return value.toISOString();
    } else if (value instanceof DateTime) {
      return value.toISO();
    }
  }

  from(value?: string | number | Date): DateTime | undefined {
    if (value == null) {
      return undefined;
    } else if (typeof value === 'string') {
      return DateTime.fromISO(value);
    } else if (typeof value === 'number') {
      return DateTime.fromSeconds(value);
    } else if (value instanceof Date) {
      return DateTime.fromJSDate(value);
    } else {
      throw new Error('unexpected type');
    }
  }
}
