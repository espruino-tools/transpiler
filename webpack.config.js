const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    main: './src/index.ts',
  },
  output: {
    path: path.resolve(__dirname, './min'),
    filename: 'main.min.js', // <--- Will be compiled to this single file
    libraryTarget: 'var',
    library: 'ESPT_Transpiler',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({ parallel: true })],
  },
};
