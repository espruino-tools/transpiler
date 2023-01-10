/**
 * This file collates the parser and calls the traverser
 */

/*
    code -> parser -> traverser -> transformer -> generator -> newcode

    ast = parser()
    newAst = transformer() // traverser is in here
    output = codeGenerator

    return output;
*/
