import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseStringPipe implements PipeTransform {
  transform(value: any): string {
    if (typeof value !== 'string') {
      throw new BadRequestException('Validation failed: input must be a string');
    }

    if (!value.trim()) {
      throw new BadRequestException('Validation failed: string cannot be empty or only whitespace');
    }

    return value;
  }
}
