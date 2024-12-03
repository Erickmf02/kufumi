import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParsePositiveIntArrayPipe implements PipeTransform {
  transform(value: any): number[] {
    // Verifica si el valor es un string
    if (typeof value !== 'string') {
      throw new BadRequestException('Validation failed: input must be a string');
    }

    // Intenta parsear el string como un array
    let parsedValue: any;
    try {
      parsedValue = JSON.parse(value);
    } catch (e) {
      throw new BadRequestException('Validation failed: input must be a valid array string');
    }

    // Verifica que el valor parseado sea un array
    if (!Array.isArray(parsedValue)) {
      throw new BadRequestException('Validation failed: input must be an array');
    }

    // Verifica que cada elemento del array sea un entero positivo
    const result = parsedValue.map(item => {
      if (typeof item !== 'number' || !Number.isInteger(item) || item <= 0) {
        throw new BadRequestException('Validation failed: each item in the array must be a positive integer');
      }
      return item;
    });

    // Si todas las validaciones pasan, retorna el array de números enteros positivos
    return result;
  }
}
