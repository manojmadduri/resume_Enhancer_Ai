module.exports = function override(config, env) {
    config.resolve.fallback = {
        ...config.resolve.fallback,
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "util": false,
        "zlib": require.resolve("browserify-zlib"),
        "stream": require.resolve("stream-browserify"),
        "url": require.resolve("url"),
        "assert": require.resolve("assert"),
        "buffer": require.resolve("buffer"),
        "process": require.resolve("process/browser")
    };

    config.plugins = [
        ...config.plugins,
        new (require('webpack').ProvidePlugin)({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer']
        })
    ];

    return config;
};
