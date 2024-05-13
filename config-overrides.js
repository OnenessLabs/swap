const { override, addExternalBabelPlugins, babelInclude } = require('customize-cra')

const supportMjs = () => webpackConfig => {
  webpackConfig.module.rules.push({
    test: /\.mjs$/,
    include: /node_modules/,
    type: 'javascript/auto'
  })
  return webpackConfig
}

module.exports = {
  webpack: override(
    ...addExternalBabelPlugins('@babel/plugin-transform-optional-chaining'),
    ...addExternalBabelPlugins('@babel/plugin-transform-nullish-coalescing-operator')
  )
}

// const { override, babelExclude, addWebpackModuleRule, addExternalBabelPlugins } = require('customize-cra')
// const path = require('path')

// module.exports = {
//   // webpack: override(babelExclude([/node_modules\/*/]))
//   webpack: override(
//     ...addExternalBabelPlugins('@babel/plugin-transform-optional-chaining'),
//     ...addExternalBabelPlugins('@babel/plugin-transform-nullish-coalescing-operator'),
//     addWebpackModuleRule({
//       test: /(\.es\.js|\.mjs)$/,
//       exclude: {
//         and: [/node_modules/]
//       },
//       use: {
//         loader: 'babel-loader'
//       }
//     })
//   )
// }
