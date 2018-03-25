var webpack = require('webpack')
var path = require('path')

module.exports = {
    entry: {
        app: [
            './js/main.js',
            './scss/main.scss'
        ]
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: '/build/',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            },{
                test: /\.scss$/,
                use: [
                    {
                        loader: 'style-loader'
                    },{
                        loader: 'css-loader'
                    },{
                        loader: 'postcss-loader',
                        options: {
                            plugins: function(){
                                return [
                                    require('precss'),
                                    require('autoprefixer')
                                ];
                            }
                        }
                    },{
                        loader: 'sass-loader'
                    }
                ]
            },{
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: 'fonts/[name].[ext]'
                }
            },{
                test: /\.(png|jpg|gif)$/,
                use: [
                  {
                    loader: 'url-loader',
                    options: {}
                  }
                ]
            },{
                test: /\.(json)$/,
                use: [
                  {
                    loader: 'json-loader',
                    options: {}
                  }
                ]
            }
        ]
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true
    },
    devtool: 'source-map',
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Popper: ['popper.js', 'default']
        }),
	new webpack.DefinePlugin({
	    'process.env.NODE_ENV': JSON.stringify('production')
	}),
	new webpack.optimize.UglifyJsPlugin({
	    sourceMap: true
	})
    ]
}
