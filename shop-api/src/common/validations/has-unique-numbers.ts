import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from 'class-validator';

/**
 * Validador personalizado para verificar que cada número en el array es único.
 * Utiliza un Set de JavaScript para comparar la longitud del array original con la longitud del Set
 * (que solo contiene valores únicos). Si ambos tamaños coinciden, significa que todos los números
 * en el array son únicos.
 */
@ValidatorConstraint({ async: false })
class HasUniqueNumbersConstraint implements ValidatorConstraintInterface {
  
  /**
   * Método que realiza la validación.
   * 
   * @param value El valor del campo que se está validando (en este caso, un array de números).
   * @param args Argumentos adicionales de validación (no utilizados en este caso).
   * 
   * @returns {boolean} Retorna true si todos los números en el array son únicos, de lo contrario false.
   */
  validate(value: number[], args: ValidationArguments): boolean {
    if (!Array.isArray(value)) return false; // Verifica que el valor sea un array
    const uniqueNumbers = new Set(value); // Crea un Set para obtener solo números únicos
    return uniqueNumbers.size === value.length; // Compara el tamaño del array con el tamaño del Set
  }

  /**
   * Mensaje predeterminado cuando la validación falla.
   * 
   * @param args Argumentos de validación que se pasan al decorador.
   * 
   * @returns {string} El mensaje que se muestra cuando los números no son únicos.
   */
  defaultMessage(args: ValidationArguments): string {
    return 'Each number in the array must be unique.'; // Mensaje por defecto
  }
}

/**
 * Decorador personalizado para verificar que cada número dentro de un array es único.
 * 
 * Este decorador se puede aplicar a propiedades que sean un array de números y validará
 * que no haya valores repetidos en el array. Si hay duplicados, se lanzará un mensaje de error.
 * 
 * Ejemplo de uso:
 * ```ts
 * class SomeDto {
 *   @HasUniqueNumbers()
 *   numbers: number[];
 * }
 * ```
 * 
 * @param validationOptions Opciones de validación adicionales que se pueden pasar al decorador.
 * 
 * @returns {Function} El decorador que se puede aplicar a la propiedad.
 */
export function HasUniqueNumbers(validationOptions?: any) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions, // Permite pasar opciones adicionales de validación.
      constraints: [],
      validator: HasUniqueNumbersConstraint, // Asociamos el validador personalizado
    });
  };
}
