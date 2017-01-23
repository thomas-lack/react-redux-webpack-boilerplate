let path = require('path'),
	fs = require('fs'),
	webpack = require('webpack'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	config;

const babelSettings = JSON.parse(fs.readFileSync('.babelrc')),
	src = path.join(__dirname, '/src/public');

config = {
	entry: {
		app: path.join(__dirname, '/src/public/js/index.js'),
		vendor: [ 'react', 'redux', 'react-dom', 'react-redux' ]
	},
	output: {
		path: path.join(__dirname, '/public'),
		filename: '/js/[name].min.js'	// possible options: [name], [hash], [chunkhash]
	},
	resolve: {
		// you can now "require('file')" instead of "require('file.js')"
		extensions: [ '.js', '.jsx' ]
	},
	// 'eval' for development, 'source-map' for slower development and production (?)
	devtool: 'eval',
	module: {
		loaders: [
			// at first check syntactical correctness with eslint
			{
				enforce: 'pre',
				test: /\.(js|jsx)$/,
				include: src,
				exclude: path.join(__dirname, '/node_modules'),
				loader: 'eslint-loader'
			},
			// include javascript files and translate jsx files into js
			{
				test: /\.(js|jsx)$/,
				include: src,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: babelSettings
			},
			// include json configuration files
			{
				test: /\.json$/,
				loader: 'json-loader'
			},
			// include and translate css and less files, modify framework standard values during
			// translation
			{
				test: /\.(css|less)$/,
				loader: ExtractTextPlugin.extract({
					fallbackLoader: 'style-loader',
					loader: [
						{
							loader: 'css-loader',
							query: {
								sourceMap: true,
								importLoaders: 1
							}
						},
						{
							loader: 'less-loader',
							query: {
								sourceMap: true,
								modifyVars: {
									'@icon-url': '\'/fonts/iconfont\''
								}
							}
						}
					]
				})
			}
		]
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		}),
		new webpack.optimize.CommonsChunkPlugin({
			names: [ 'vendor', 'manifest' ]
		}),
		new ExtractTextPlugin('/css/app.bundle.css')
	]
};

module.exports = [ config ];