const webpack = require('webpack');
const path = require('path');
const Dotenv = require('dotenv-webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index-[contenthash:6].js',
    path: path.join(__dirname, '../dist'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(scss|sass)$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.(js|jsx|ts|tsx)$/i,
        loader: 'babel-loader',
        exclude: /node_modules/,
        resolve: {
          extensions: ['.ts', '.tsx', '.js', '.jsx'],
          plugins: [
            new TsconfigPathsPlugin({
              configFile: path.resolve(__dirname, '../tsconfig.json'),
              extensions: ['.ts', '.tsx', '.js', '.jsx'],
            }),
          ],
        },
        options: {
          presets: [
            ['@babel/preset-env', { useBuiltIns: 'usage', corejs: '2.0.0' }],
            ['@babel/preset-react', { runtime: 'automatic' }],
            '@babel/preset-typescript'
          ]
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Budoman',
      filename: 'index.html',
      template: './src/index.html',
      favicon: path.resolve(__dirname, '../src/assets/favicon.png')
    }),
    new MiniCssExtractPlugin({
      filename: 'main-[contenthash:6].css'
    }),
    new Dotenv({
      path: path.resolve(__dirname, '../.env'),
      systemvars: true
    }),
    new webpack.ProvidePlugin({
      React: 'react'
    })
  ],
  devtool: 'eval-cheap-source-map'
};
