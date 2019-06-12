import { ValueTransformer } from 'typeorm';

export class TimestampTzTransformer implements ValueTransformer {
  to(value?: number | Date): Date | undefined {
    if (value == null) {
      return undefined;
    }

    const value_type = typeof value;

    if (value_type === 'number') {
      return new Date(value);
    }
  }

  from(value?: string | Date): Date | undefined {
    if (value == null) {
      return undefined;
    }

    const value_type = typeof value;

    if (value_type === 'string' || value_type === 'number') {
      return new Date(value);
    } else if (value instanceof Date) {
      return value;
    } else {
      throw new Error('unexpected type');
    }
  }
}
