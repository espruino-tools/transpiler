import { generator_options } from './types/generator';

/**
 * This will generate code from the AST
 * @param ast
 */
export const generator = (ast: any, options: generator_options) => {
  const getObjectNames = (ast: any): string[] => {
    let callee_names = [
      'Puck',
      'Pixl',
      'Bangle',
      'DeviceController',
      ...options.additional_callees,
    ];

    return [];
  };

  const getExpressions = (ast: any): any => {};
};
