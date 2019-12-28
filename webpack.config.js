const path = require('path');
const outputDir = path.resolve(__dirname, 'dist/js');
const chalk = require('chalk');
const log = require('fancy-log');
const TerserPlugin = require('terser-webpack-plugin');

log(`${chalk.blue('Webpack')} running in ${chalk.bold.blackBright.bgGreenBright(' '+process.env.NODE_ENV+' ')} mode`);

let optimization = {};
let sourceMap = {};
let devtool = false;

if (process.env.NODE_ENV === 'production') {
	optimization = {
		concatenateModules: true,
		minimize: true,
		minimizer: [
			new TerserPlugin({
				parallel: true,
				terserOptions: {
					ecma: 6,
				},
			})
		]
	};
} else {
	devtool = 'source-map';
	sourceMap = {
		test: /\.js$/,
		use: ['source-map-loader'],
		enforce: 'pre'
	};
}

module.exports = {
	mode: 'production',
	entry: path.resolve(__dirname, 'src/js'),
	output: {
		path: outputDir,
		filename: 'bundle.js'
	},
	devtool: devtool,
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: ['babel-loader']
			}, sourceMap
		]
	},
	optimization: optimization
};
