import { SetMetadata } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../../user/user.entity';

/**
 * TODO: write description
 * TODO: Write UserEditable decorator
 */

/**
 * Marks property as included in the process of transformation. By default it includes the property for both
 * constructorToPlain and plainToConstructor transformations, however you can specify on which of transformation types
 * you want to skip this property.
 */
// export function UserEditable() {}
// {
//   return function(propertyName?: string) {
//     const metadata = 'test';
//     // defaultMetadataStorage.addExposeMetadata(metadata);
//   };
// }

// export function UserEditable(
//   options?: Record<string, any>,
//   validationOptions?: string,
// ) {
//   return function(object: Record<string, any>, propertyName: string) {
//     const args = {
//       type: 1,
//       target: object.constructor,
//       propertyName: propertyName,
//       constraints: [options],
//       validationOptions: validationOptions,
//     };
//   };
// }

export function UserEditable(
  options?: Record<string, any>,
  validationOptions?: string,
) {
  return function(object: Record<string, any>, propertyName: string) {
    const args = {
      type: 1,
      target: object.constructor,
      propertyName: propertyName,
      constraints: [options],
      validationOptions: validationOptions,
    };
  };
}

// export const UserEditable = (...user_editable: string[]) => {
//   console.log(user_editable);
//   return SetMetadata('this_is_a_thing', user_editable);
// };

// export function UserEditable(metadata: string): Function {
//   console.log(metadata);
//   return function(target: any, key: any, descriptor: any) {
//     console.log(target);
//     console.log(key);
//     // console.log(`${b}_user_editable`);
//     // target[`${b}_user_editable`] = metadata;
//     if (descriptor != null) {
//       Reflect.defineMetadata(`mything:${key}`, metadata, descriptor.value);
//       return descriptor;
//     } else {
//       Reflect.defineMetadata(`mything:${key}`, metadata, target);
//       return target;
//     }
//   };
// }
