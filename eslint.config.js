const lincy = require('@lincy/eslint-config').lincy

const config = lincy(
    {
        unocss: false,
    },

    {
        ignores: [
            '**/assets',
            '**/static',
        ],
    },
)

module.exports = config
