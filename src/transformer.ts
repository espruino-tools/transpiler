import { mappings } from './mappings';
import { generator_options } from './types/generator';
import * as esprima from 'esprima';
/**
 * This will replace code in AST pre-rebuilding
 * @param ast
 */

export const transformer = (ast: any, options: generator_options) => {
  let callee_names = [
    'Puck',
    'Pixl',
    'Bangle',
    'DeviceController',
    ...options.additional_callees,
  ];
  const getInstanceInitialising = (ast: any): string[] => {
    let variable_declarations = ast.body.filter(
      (x: any) => x.type == 'VariableDeclaration',
    );
    let esp_inititalising_vars = variable_declarations.filter((x: any) =>
      callee_names.includes(x.declarations[0].init.callee?.name),
    );

    return esp_inititalising_vars.map((x: any) => ({
      name: x.declarations[0].id.name,
      initialiser: x.declarations[0].init.callee.name,
    }));
  };

  const convertToAST = (code: string, params: any[]) => {
    let code_arr = code.split('.');
    let expression_func = code_arr.reduce(
      (prev, curr) => (prev as any)[curr],
      mappings,
    ) as any;

    return esprima.parseScript(expression_func(...params)).body[0];
  };

  const replaceExpression = (x: any) => {
    let esp_initialising_vars = getInstanceInitialising(ast);

    let device_variable: string;

    if (x.expression.callee.object.type === 'MemberExpression') {
      device_variable = x.expression.callee.object.object.name;
    } else if (x.expression.callee.object.type === 'Identifier') {
      device_variable = x.expression.callee.object.name;
    } else {
      device_variable = '';
    }

    if (
      !esp_initialising_vars.map((x: any) => x.name).includes(device_variable)
    ) {
      return x;
    } else {
      let device_init: any = esp_initialising_vars.find(
        (x: any) => x.name === device_variable,
      );

      let phrase = device_init.initialiser + '.';

      if (x.expression.callee.object.property?.name) {
        phrase +=
          x.expression.callee.object.property?.name &&
          x.expression.callee.object.property?.name + '.';
      }

      let params: any[] = x.expression.arguments.map((x: any) => x.value);

      phrase += x.expression.callee.property.name;
      return convertToAST(phrase, params);
    }
  };

  const removeInitsAndImports = (ast: any) => {
    let val;

    switch (ast.type) {
      case 'ImportDeclaration': {
        val = ast.source.value.includes('espruino-tools') ? '' : ast;
        break;
      }
      case 'VariableDeclaration': {
        if (ast.declarations[0].init.hasOwnProperty('callee')) {
          val = callee_names.includes(ast.declarations[0].init.callee?.name)
            ? ''
            : ast;
        } else {
          val = ast;
        }
        break;
      }
    }

    return val;
  };

  const getExpressions = (ast: any): any => {
    let ast_copy: any = { ...ast };

    ast_copy.body = ast.body
      .map((x: any) =>
        x.type === 'ExpressionStatement'
          ? replaceExpression(x)
          : removeInitsAndImports(x),
      )
      .filter((x: any) => x !== '');

    return ast_copy;
  };

  return getExpressions(ast);
};
