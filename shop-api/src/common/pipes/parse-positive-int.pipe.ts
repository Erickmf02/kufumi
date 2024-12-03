import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParsePositiveIntPipe implements PipeTransform {
  transform(value: any): number {
    if (typeof value !== 'string') {
      throw new BadRequestException('Validation failed: input must be a string');
    }

    const parsedValue = Number(value);

    if (isNaN(parsedValue)) {
      throw new BadRequestException('Validation failed: input must be a numeric string');
    }

    if (!Number.isInteger(parsedValue)) {
      throw new BadRequestException('Validation failed: input must be an integer');
    }

    if (parsedValue <= 0) {
      throw new BadRequestException('Validation failed: input must be a positive integer');
    }

    return parsedValue;
  }
}
