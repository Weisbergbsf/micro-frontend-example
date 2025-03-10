const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { ModuleFederationPlugin } = webpack.container;
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { argv } = require('process');
const { resolve } = require('path');
const { cache } = require('react');
const deps = require('./package.json').dependencies;
require('dotenv').config({ path: './.env' });

const buildDate = new Date().toISOString();
const buildVersion = process.env.BUILD_VERSION || '0.0.0';

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    return {
        entry: './src/index.ts',
        mode: process.env.NODE_ENV || 'development',
        devServer: {
            port: 3000,
            open: true,
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
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    options: {
                        cacheDirectory: true,
                        babelrc: false,
                        presets: [
                            [
                                '@babel/preset-env',
                                { targets: { browsers: 'last 2 versions' } },
                            ],
                            '@babel/preset-react',
                            '@babel/preset-typescript',
                        ],
                        plugins: [
                            ["@babel/plugin-proposal-class-properties", { loose: true }],
                            [
                                "@babel/plugin-proposal-private-property-in-object",
                                { loose: true },
                            ],
                            ["@babel/plugin-proposal-private-methods", { loose: true }],
                        ],
                    }
                }
            ]
        },
        plugins: [
            new webpack.EnvironmentPlugin({
                BUILD_DATE: buildDate,
                BUILD_VERSION: buildVersion,
            }),
            new webpack.DefinePlugin({
                'process.env': JSON.stringify(process.env),
            }),
            new ModuleFederationPlugin({
                name: 'main',
                remotes: {
                    products: isProduction ? process.env.PROD_PRODUCTS : process.env.DEV_PRODUCTS,
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
            new ForkTsCheckerWebpackPlugin(),
        ],
    }
}