import { ValueTransformer } from 'typeorm';
import * as PostgresInterval from 'postgres-interval';
import { IPostgresInterval } from 'postgres-interval';
import { Duration, DurationObject } from 'luxon';

export class IntervalTransformer implements ValueTransformer {
  to(value?: number | Duration): string | undefined {
    if (value == null) {
      return undefined;
    } else if (typeof value === 'number') {
      return Duration.fromMillis(value).toISO();
    } else if (value instanceof Duration) {
      return value.toISO();
    }
  }

  from(value?: string | number | IPostgresInterval): Duration | undefined {
    if (value == null) {
      return undefined;
    } else if (typeof value === 'number') {
      return Duration.fromMillis(value);
    } else if (value instanceof PostgresInterval) {
      // TS misunderstands the typing here, so we force it to the correct one
      value = value as IPostgresInterval;
      // strip everything but these keys from object
      // `Duration.fromObject` will throw an error otherwise
      let dur_obj: DurationObject = {
        years: value.years,
        months: value.months,
        days: value.days,
        hours: value.hours,
        minutes: value.minutes,
        seconds: value.seconds,
        milliseconds: value.milliseconds,
      };
      return Duration.fromObject(dur_obj);
    } else {
      throw new Error('unexpected type');
    }
  }
}
