const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const deps = require('./package.json').dependencies;

module.exports = {
    entry: './src/index.ts',
    mode: 'development',
    devServer: {
        port: 3001,
        //open: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                //test: /\.(js|jsx|tsx|ts)$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    plugins: [
        new ModuleFederationPlugin({
            name: 'products',
            filename: 'remoteEntry.js',
            exposes: {
                './Products': './src/App',
            },
            shared: {
                ...deps,
                react: { singleton: true, eager: true, requiredVersion: deps.react },
                "react-dom": {
                    singleton: true,
                    eager: true,
                    requiredVersion: deps["react-dom"],
                },
                "react-router-dom": {
                    singleton: true,
                    eager: true,
                    requiredVersion: deps["react-router-dom"],
                },
            },
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
    ],
}