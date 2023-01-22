import { mappings } from './mappings';
import { generator_options } from './types/generator';
import * as esprima from 'esprima';
import { generator } from './generator';
import { check } from 'prettier';

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
    ...(options.additional_initialisers
      ? (options.additional_initialisers as string[])
      : []),
  ];
  const getInstanceInitialising = (ast: any): string[] => {
    let variable_declarations = ast.body.filter(
      (x: any) => x.type == 'VariableDeclaration',
    );
    let esp_inititalising_vars = variable_declarations.filter((x: any) =>
      callee_names.includes(x.declarations[0].init.callee?.name),
    );

    let callees = [
      ...esp_inititalising_vars.map((x: any) => ({
        name: x.declarations[0].id.name,
        initialiser: x.declarations[0].init.callee.name,
      })),
      ...(options.additional_callees as any[]),
    ];
    return callees;
  };

  const convertToAST = (code: string, params: any[]) => {
    let code_arr = code.split('.');
    let expression_func = code_arr.reduce(
      (prev, curr) => (prev as any)[curr],
      mappings,
    ) as any;

    return esprima.parseScript(expression_func(...params)).body[0];
  };

  const replaceReturnedExpression = (x: any) => {
    if (x?.type === 'Identifier') {
      return x;
    }

    let esp_initialising_vars = getInstanceInitialising(ast);
    let device_variable: string = x?.callee?.object?.object?.name;

    let device_init: any = esp_initialising_vars.find(
      (x: any) => x.name === device_variable,
    );

    let phrase = device_init.initialiser + '.';

    if (x.callee.object.property?.name) {
      phrase +=
        x.callee.object.property?.name && x.callee.object.property?.name + '.';
    }

    let params: any[] = x.arguments.map((y: any) => {
      if (y.hasOwnProperty('value')) {
        return y.value;
      } else {
        let transformer_out = transformer(x.body, {
          additional_callees: getInstanceInitialising(ast),
        });

        return generator(transformer_out, {
          additional_callees: [],
        });
      }
    });

    phrase += x.callee.property.name;

    let ast_res = convertToAST(phrase, params);
    return ast_res;
  };

  const replaceExpression = (x: any): any => {
    let esp_initialising_vars = getInstanceInitialising(ast);
    let device_variable: string;

    switch (x?.type) {
      case 'IfStatement': {
        return replaceIfStatement(x);
      }
      case 'ClassDeclaration':
        return replaceClass(x);
      case 'FunctionDeclaration':
      case 'WhileStatement':
      case 'ForStatement':
      case 'ForInStatement':
      case 'DoWhileStatement': {
        return replaceLoopStatement(x);
      }
      case 'SwitchStatement':
        return replaceSwitchStatement(x);
      case 'ContinueStatement':
      case 'BreakStatement':
        return x;
    }

    if (x?.type === 'VariableDeclaration') {
      if (x.declarations[0].init?.type === 'FunctionExpression') {
        x.declarations[0].init.body.body = x.declarations[0].init.body.body.map(
          (y: any) => replaceExpression(y),
        );
      }

      if (x.declarations[0].init?.type === 'AwaitExpression') {
        return x;
      }

      if (x.declarations[0].init?.type === 'ObjectExpression') {
        x.declarations[0].init.properties =
          x.declarations[0].init.properties.map((y: any) => {
            if (y.value.type === 'FunctionExpression') {
              y.value = replaceLoopStatement(y.value);
            } else if (y.value.type === 'CallExpression') {
              y.value = replaceReturnedExpression(y.value);
            } else if (x.value.type === 'ArrowFunctionExpression') {
              y.value.body = replaceReturnedExpression(y.value.body);
            }
            return y;
          });

        return x;
      }
    }

    if (x?.type === 'ReturnStatement') {
      if (x.argument.type === 'Literal') {
        return x;
      }

      x.argument = replaceReturnedExpression(x.argument);

      return x;
    }

    if (x?.expression.type === 'LogicalExpression') {
      if (x.expression.right.type !== 'Literal') {
        x.expression.right = replaceReturnedExpression(x.expression.right);
      }
      if (x.expression.left.type !== 'Literal') {
        x.expression.left = replaceReturnedExpression(x.expression.left);
      }
      return x;
    }

    if (x?.expression.type === 'ConditionalExpression') {
      x.expression.consequent = replaceReturnedExpression(
        x.expression.consequent,
      );
      x.expression.alternate = replaceReturnedExpression(
        x.expression.alternate,
      );
      return x;
    }

    if (x?.expression.type === 'AssignmentExpression') {
      return x;
    }

    if (x?.expression?.callee?.object.type === 'MemberExpression') {
      device_variable = x.expression.callee.object.object.name;
    } else if (x?.expression?.callee?.object?.type === 'Identifier') {
      device_variable = x.expression.callee.object.name;
    } else {
      device_variable = '';
    }

    if (x?.expression?.object?.type === 'ThisExpression') {
      return x;
    }

    if (
      !esp_initialising_vars.map((x: any) => x.name).includes(device_variable)
    ) {
      if (x?.expression.arguments instanceof Array) {
        x.expression.arguments = x.expression.arguments.map((y: any) => {
          if (y.hasOwnProperty('value')) {
            return y.value;
          } else {
            if (y.body.hasOwnProperty('body')) {
              y.body.body = y.body.body.map((z: any) => replaceExpression(z));
            }
            return y;
          }
        });
      }

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

      let params: any[] = x.expression.arguments.map((x: any) => {
        if (x.hasOwnProperty('value')) {
          return x.value;
        } else {
          let transformer_out = transformer(x.body, {
            additional_callees: getInstanceInitialising(ast),
          });

          return generator(transformer_out, {
            additional_callees: [],
          });
        }
      });

      phrase += x.expression.callee.property.name;

      let ast_res = convertToAST(phrase, params);
      return ast_res;
    }
  };

  const removeInitsAndImports = (ast: any): any => {
    let val;
    switch (ast.type) {
      case 'ImportDeclaration': {
        val = ast.source.value.includes('espruino-tools') ? '' : ast;
        break;
      }
      case 'VariableDeclaration': {
        if (ast.declarations[0].init?.type === 'FunctionExpression') {
          ast.declarations[0].init.body.body =
            ast.declarations[0].init.body.body.map((x: any) =>
              replaceExpression(x),
            );
        }

        if (ast.declarations[0].init?.type === 'ObjectExpression') {
          ast.declarations[0].init.properties =
            ast.declarations[0].init.properties.map((x: any) => {
              if (x.value.type === 'FunctionExpression') {
                x.value = replaceLoopStatement(x.value);
              } else if (x.value.type === 'CallExpression') {
                x.value = replaceReturnedExpression(x.value);
              } else if (x.value.type === 'ArrowFunctionExpression') {
                x.value.body = replaceReturnedExpression(x.value.body);
              }
              return x;
            });
        }

        if (ast.declarations[0].init?.type === 'ArrowFunctionExpression') {
          if (ast.declarations[0].init.body.body instanceof Array) {
            ast.declarations[0].init.body.body =
              ast.declarations[0].init.body.body.map((x: any) =>
                replaceExpression(x),
              );
          } else {
            ast.declarations[0].init.body = replaceReturnedExpression(
              ast.declarations[0].init.body,
            );
          }
        }

        if (ast.declarations[0].init.hasOwnProperty('callee')) {
          val = callee_names.includes(ast.declarations[0].init.callee?.name)
            ? ''
            : ast;
        } else {
          val = ast;
        }
        break;
      }
      default:
        return ast;
    }

    return val;
  };

  const replaceIfExpressions = (x: any) => {
    let x_copy = { ...x };

    if (x_copy.type === 'BlockStatement') {
      x_copy.body = x_copy.body.map((y: any) => replaceExpression(y));
    }
    if (x_copy.type === 'IfStatement') {
      return replaceIfStatement(x_copy);
    }
    return x_copy;
  };

  const replaceIfStatement = (x: any) => {
    let if_copy = { ...x };

    if_copy.consequent = replaceIfExpressions(x.consequent);
    if (if_copy.alternate) {
      if_copy.alternate = replaceIfExpressions(x.alternate);
    }
    return if_copy;
  };

  const replaceLoopStatement = (x: any) => {
    let loop_copy = { ...x };
    loop_copy.body.body = loop_copy.body.body.map((y: any) =>
      replaceExpression(y),
    );
    return loop_copy;
  };

  const replaceSwitchStatement = (x: any) => {
    let switch_copy = { ...x };

    switch_copy.cases = switch_copy.cases.map(
      (y: any) =>
        (y.consequent = y.consequent.map((z: any) => replaceExpression(z))),
    );

    return x;
  };

  const replaceClass = (x: any) => {
    let class_copy = { ...x };

    class_copy.body.body = class_copy.body.body.map((y: any) => {
      y.value = replaceLoopStatement(y.value);
      return y;
    });

    return class_copy;
  };

  const replaceTryCatch = (x: any) => {
    x.block.body = x.block.body.map((y: any) => {
      return replaceExpression(y);
    });
    x.handler.body.body = x.handler.body.body.map((y: any) => {
      return replaceExpression(y);
    });
    return x;
  };

  const getExpressions = (ast: any): any => {
    let ast_copy: any = { ...ast };

    ast_copy.body = ast.body
      .map((x: any) => {
        switch (x.type) {
          case 'ExpressionStatement': {
            return replaceExpression(x);
          }
          case 'TryStatement': {
            return replaceTryCatch(x);
          }
          case 'IfStatement': {
            return replaceIfStatement(x);
          }
          case 'ClassDeclaration':
            return replaceClass(x);
          case 'FunctionDeclaration':
          case 'WhileStatement':
          case 'ForStatement':
          case 'ForInStatement':
          case 'AsyncFunctionDeclaration':
          case 'DoWhileStatement': {
            return replaceLoopStatement(x);
          }
          case 'SwitchStatement':
            return replaceSwitchStatement(x);

          default: {
            return removeInitsAndImports(x);
          }
        }
      })
      .filter((x: any) => x !== '');

    return ast_copy;
  };

  return getExpressions(ast);
};
