// module.exports = {
//   env: {
//     browser: true,
//     commonjs: true,
//     es2021: true,
//   },
//   extends: 'airbnb-base',
//   overrides: [
//   ],
//   parserOptions: {
//     ecmaVersion: 'latest',
//   },
//   rules: {
//   },
// };

module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    extends: ['airbnb-base', 'prettier'],
    env: {
        es2021: true,
        node: true,
    },
    rules: {
        'no-console': 'off',
        'no-underscore-dangle': 'off',
    },
}
