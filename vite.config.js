const isCodeSandbox = 'SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env

export default {
    root: 'src/',
    publicDir: '../static/',
    base: './',
    server:
    {
        host: true,
        port: 5172
    },
    build:
    {
        outDir: '../dist',
        emptyOutDir: true,
        // sourcemap: true
    }
}