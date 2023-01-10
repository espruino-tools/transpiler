/**
 * This package provides both a cli and an exported function to
 * allow for transpiling within a file or across a directory.
 *
 * SIDENOTE:
 * CLI may be better placed in a seperate package, which recursively
 * applies this package.
 */

import { transpile } from './transpile';

import * as esprima from 'esprima';

export default transpile;
