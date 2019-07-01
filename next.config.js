const { parsed: localEnv } = require('dotenv').config()
const webpack = require('webpack')

module.exports = {
	target: 'serverless',
	webpack: (config, { buildId, dev, isServer, defaultLoaders }) => {
		config.plugins.push(new webpack.EnvironmentPlugin(localEnv))
		return config
	},
	// exportPathMap: () => {
	// 	return {
	// 		'/': {
	// 			page: '/',
	// 		},
	// 	}
	// },
}
