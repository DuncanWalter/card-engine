const webpack = require('webpack');
const path = require('path');
const options = require('minimist')(process.argv.slice(2));
const createConfig = require('./webpack.config');
const { spawn } = require('child_process');
let { app, BrowserWindow } = require('electron');

let window = null;
function createWindow(){
    window = new BrowserWindow({ fullscreen: true });
    window.openDevTools();
    window.on('closed', function() {
        window = null;
    });
}

const runDevWindow = createConfig => options => {

    const compiler = webpack(createConfig(options));
    // const server = new (require('express'))();
    // const DMW = require('webpack-dev-middleware');
    // const HMW = require('webpack-hot-middleware');

    // let devMiddleware;
    // server.use(devMiddleware = DMW(compiler, {
    //     publicPath: '/',
    //     quiet: true,
    //     index: 'index.bundle.html',
    //     watchOptions: {
    //         aggregateTimeout: 300,
    //         poll: true,
    //     },
    // }));
    
    // server.use(HMW(compiler, {        
    //     msg: console.log,
    //     path: '/__webpack_hmr', 
    //     heartbeat: 2000,
    // })); 
    
    // console.log('> Starting dev server...');
    // devMiddleware.waitUntilValid(() => {
    //     const port = 3674;
    //     const uri = `http://localhost:${port}`;
    //     server.listen(port);
    //     console.log(`> Listening at ${uri}\n`);      
    // });

    app.on('window-all-closed', () => {
        if(process.platform != 'darwin'){
            app.quit();
        }
    });

    if(app.isReady()){
        createWindow();
    } else {
        app.on('ready', createWindow);
    }

    compiler.watch({
        aggregateTimeout: 500, 
        poll: 100,
    }, (err, stat) => {
        if(window && !err){
            console.log('refreshing')
            window.loadURL(`file:///${__dirname}/../dist/index.bundle.html`);
        }
    })

};

const runProdBuild = createConfig => options => {
    console.log("> Starting production build...");
    webpack(createConfig(options), () => {
        console.log("> Completed production build!");
        if(window){
            window.loadURL(`file:///${__dirname}/../dist/index.bundle.html`);
        }
    });

    app.on('window-all-closed', () => {
        if(process.platform != 'darwin'){
            app.quit();
        }
    });

    if(app.isReady()){
        createWindow()
    } else {
        app.on('ready', createWindow);
    }
};

const runTestSuite = createConfig => options => {
    webpack(createConfig(options), () => {
        const p = spawn('node', [path.join(__dirname, '../dist/index.bundle.js')]);
        p.stdout.on('data', d => console.log('' + d));
        p.stderr.on('data', d => console.log('' + d));
    });
};

const executeBundle = options => {
    switch(true){
        case options.dev:{
            return runDevWindow(createConfig)(options);
        }
        case options.prod:{
            return runProdBuild(createConfig)(options);
        }
        case options.test:{
            return runTestSuite(createConfig)(options);
        }
    }
};

if(options.run){
    executeBundle(options);
}






// OLD CODE FOR STRAIGHT WEB SERVER... MAY BE USEFUL?

// const compiler = webpack(createConfig(options));
// const { app, useOptions } = require('home-in-on-your-homies-server');
// const DMW = require('koa-webpack-dev-middleware');
// const HMW = require('koa-webpack-hot-middleware');

// useOptions({
//     publicPath: path.join(__dirname, '../dist'),
// });

// app.use(devMiddleware = DMW(compiler, {
//     publicPath: '/',
//     quiet: true,
//     index: 'index.bundle.html',
//     watchOptions: {
//         aggregateTimeout: 300,
//         poll: true,
//     },
// }));

// app.use(hotMiddleware = HMW(compiler, {        
//     msg: console.log,
//     path: '/__webpack_hmr', 
//     heartbeat: 2000,
// }));

// console.log('> Starting dev server...');
// devMiddleware.waitUntilValid(() => {
//     const port = 3674;
//     const uri = `http://localhost:${port}`;
//     console.log(`> Listening at ${uri}\n`);      
//     app.listen(port);
// });