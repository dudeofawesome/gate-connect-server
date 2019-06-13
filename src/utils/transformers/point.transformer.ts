import { ValueTransformer } from 'typeorm';

import { Point } from '../../gate/point';

export class PointTransformer implements ValueTransformer {
  to(
    value: Point | string | { x: number; y: number } | undefined,
  ): string | undefined {
    console.log('TO value');
    console.log(value);
    if (value == null) {
      return undefined;
    } else if (typeof value === 'string') {
      if (value.toLowerCase().startsWith('point(')) {
        return value.slice('point('.length, value.length - 1);
      } else {
        return value;
      }
    } else if (value instanceof Point) {
      return value.toString();
    } else if (value.x != null && value.y != null) {
      return `${value.x},${value.y}`;
    }
  }

  from(
    value: string | { x: number; y: number } | undefined,
  ): Point | undefined {
    console.log('FROM value');
    console.log(value);
    if (value == null) {
      return undefined;
    } else if (typeof value === 'string') {
      return new Point(0, 0);
    } else if (value.x != null && value.y != null) {
      return new Point(value.x, value.y);
    } else {
      console.log((value as any).constructor);
      throw new Error('unexpected type');
    }
  }
}
