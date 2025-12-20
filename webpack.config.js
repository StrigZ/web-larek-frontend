// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { DefinePlugin } = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const sass = require('sass');

require('dotenv').config({
	path: path.join(
		process.cwd(),
		process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env'
	),
});

const isProduction = process.env.NODE_ENV == 'production';

const stylesHandler = MiniCssExtractPlugin.loader;

const config = {
	entry: './src/index.ts',
	devtool: 'source-map',
	output: {
		path: path.resolve(__dirname, 'dist'),
		publicPath: 'web-larek-frontend'
	},
	devServer: {
		open: true,
		host: 'localhost',
		watchFiles: ['src/pages/*.html'],
		hot: true,
	},
	plugins: [
		new webpack.DefinePlugin({
   		'process.env.API_BASE_URL': JSON.stringify(process.env.API_BASE_URL)
  		}),		
		new HtmlWebpackPlugin({
			template: 'src/pages/index.html',
		}),

		new MiniCssExtractPlugin(),

		// Add your plugins here
		// Learn more about plugins from https://webpack.js.org/configuration/plugins/
		new DefinePlugin({
			'process.env.DEVELOPMENT': !isProduction,
			'process.env.API_ORIGIN': JSON.stringify(process.env.API_ORIGIN ?? ''),
		}),
	],
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/i,
				use: [
					'babel-loader',
					{
						loader: 'ts-loader',
						options: {
							transpileOnly: true
         			}
					}
			],
				exclude: ['/node_modules/'],
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					stylesHandler,
					'css-loader',
					'postcss-loader',
					'resolve-url-loader',
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
							sassOptions: {
								includePaths: ['src/scss'],
								silenceDeprecations: [
									'legacy-js-api',
									'import',
									'function-units',
									'slash-div',
									'global-builtin',
								],
							},
						},
					},
				],
			},
			{
				test: /\.css$/i,
				use: [stylesHandler, 'css-loader', 'postcss-loader'],
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
				type: 'asset/resource',
			},

			// Add your rules for custom modules here
			// Learn more about loaders from https://webpack.js.org/loaders/
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
	},
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					keep_classnames: true,
					keep_fnames: true,
				},
			}),
		],
	},
};

module.exports = () => {
	if (isProduction) {
		config.mode = 'production';
	} else {
		config.mode = 'development';
	}
	return config;
};
