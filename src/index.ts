/**
 * This package provides both a cli and an exported function to
 * allow for transpiling within a file or across a directory.
 */
import { transpile } from './transpile';
import { generator } from './generator';
import { transformer } from './transformer';

export { transpile, generator, transformer };
