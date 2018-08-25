// const modulePaths = require('./modulePaths');
// const resolve = require('path').resolve;
// const fs = require('fs');
//
// // Update the following line if the root folder of your app is somewhere else.
// const ROOT_FOLDER = path.resolve(__dirname, '..');
//
// const config = {
//   transformer: {
//     getTransformOptions: () => {
//       const moduleMap = {};
//       modulePaths.forEach(path => {
//         if (fs.existsSync(path)) {
//           moduleMap[resolve(path)] = true;
//         }
//       });
//       return {
//         preloadedModules: moduleMap,
//         transform: { inlineRequires: { blacklist: moduleMap } },
//       };
//     },
//   },
// };
//
// module.exports = config;
const config = {
  transformer: {
    getTransformOptions: () => {
      return {
        transform: { inlineRequires: true },
      };
    },
  },
};
module.exports = config;
