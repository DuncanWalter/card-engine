import { render } from 'inferno'
import { App } from './app.js'
import './index.styl'

// HMR friendly bootstrapping
(function bootstrap(anchorElement){
    if(!document.getElementById('app-root')){
        render(<App/>, anchorElement);
    } 
})(document.getElementById('anchor'));

// enables HMR at this root
if( module.hot ){ 
    (module:any).hot.accept();
}
