module.exports = {
    lintOnSave: false,
    publicPath: './',
    configureWebpack: {
        module: {
            rules: [
                // Shaders
                {
                    test: /\.(glsl|vs|fs|vert|frag)$/,
                    exclude: /node_modules/,
                    use: [
                        'ts-shader-loader',
                    ],
                },
            ],
        },
    },
};