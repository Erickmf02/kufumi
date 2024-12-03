import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from 'class-validator';

/**
 * Validador personalizado para verificar que cada objeto dentro de un array tenga un "id" único.
 * Utiliza un `Set` de JavaScript para extraer los "id" de cada objeto y luego compara la longitud
 * del array con la longitud del Set (que solo contiene valores únicos). Si ambos tamaños coinciden,
 * significa que los "id"s son únicos.
 */
@ValidatorConstraint({ async: false })
class HasUniqueItemIdsConstraint implements ValidatorConstraintInterface {
  
  /**
   * Método que realiza la validación de los "id"s únicos en los objetos dentro del array.
   * 
   * @param value El valor del campo que se está validando (en este caso, un array de objetos con "id").
   * @param args Argumentos adicionales de validación (no utilizados en este caso).
   * 
   * @returns {boolean} Retorna `true` si los "id"s de todos los objetos son únicos, de lo contrario `false`.
   */
  validate(value: any[], args: ValidationArguments): boolean {
    if (!Array.isArray(value)) return false; // Verifica que el valor sea un array
    const ids = value.map(item => item.id); // Extrae los "id"s de cada objeto
    return ids.length === new Set(ids).size; // Compara la longitud del array con la longitud del Set para verificar unicidad
  }

  /**
   * Mensaje predeterminado que se devuelve cuando la validación falla.
   * 
   * @param args Argumentos de validación que se pasan al decorador.
   * 
   * @returns {string} El mensaje de error cuando los "id"s no son únicos.
   */
  defaultMessage(args: ValidationArguments): string {
    return 'Each item in the array must have a unique "id".'; // Mensaje predeterminado
  }
}

/**
 * Decorador personalizado que verifica que cada objeto dentro de un array tenga un "id" único.
 * 
 * Este decorador se puede aplicar a propiedades que sean un array de objetos, y validará
 * que cada objeto dentro del array tenga un "id" único. Si se encuentran objetos con "id"s duplicados,
 * se lanzará un mensaje de error.
 * 
 * Ejemplo de uso:
 * ```ts
 * class SomeDto {
 *   @HasUniqueItemIds()
 *   items: { id: number, name: string }[];
 * }
 * ```
 * 
 * @param validationOptions Opciones de validación adicionales que se pueden pasar al decorador.
 * 
 * @returns {Function} El decorador que se puede aplicar a la propiedad.
 */
export function HasUniqueItemIds(validationOptions?: any) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions, // Permite pasar opciones adicionales de validación.
      constraints: [],
      validator: HasUniqueItemIdsConstraint, // Asociamos el validador personalizado
    });
  };
}
