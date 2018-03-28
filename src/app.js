import { Module, loadModules } from './utils/module'
import { engine } from './engine'
import { Main } from './components/main'
import { h } from 'preact'


export const global = loadModules([engine]);
export const App = () => <div style={styles.app} id='app-root'>
   <Main/>
</div>

const styles = {
    app: {
        width: '100vw',
        height: '100vh',
    },
};
