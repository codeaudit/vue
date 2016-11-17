module.exports = {
    env: {
        browser: true,
        mocha: true,
        node: true
    },
    extends: [
        'plugin:react/recommended',
        'eslint-config-andrew-codes/specs'
    ],
    globals: {
        expect: true,
        should: true,
        suite: true,
        test: true
    },
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        }
    },
    plugins: [
        'babel',
        'import',
        'react'
    ],
    rules: {
        'react/no-did-mount-set-state': 0
    },
    settings: {
        react: {
            pragma: 'React',
            version: '15.0'
        }
    }
};