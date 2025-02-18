/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'MatchPassword', async: false })
export class MatchPassword implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    if (password !== args.object[args.constraints[0]]) return false;
    return true;
  }

  defaultMessage(args?: ValidationArguments): string {
    return 'Passwords do not match';
  }
}
