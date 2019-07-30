import { DateTime } from 'luxon';
import { Point } from '../../gate/point';

export function DateTimeToString(
  val: DateTime | undefined,
): string | undefined {
  return val ? val.toISO() : undefined;
}

export function PointToXY(
  val: Point | undefined,
): { x: number; y: number } | undefined {
  return val;
}
