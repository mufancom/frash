export type PrimitiveType = number | string | boolean | undefined;

export function isPrimitiveType(value: any): value is PrimitiveType {
  return (
    typeof value === 'number' ||
    typeof value === 'string' ||
    typeof value === 'boolean' ||
    typeof value === 'undefined'
  );
}
