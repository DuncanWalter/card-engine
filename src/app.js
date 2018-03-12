import { Module, loadModules } from './utils/module'

import { engine } from './engine'

export const global = loadModules([engine]);
export const App = () => <div style={styles.app} id='app-root'>
   { global.render() }
</div>;

const styles = {
    app: {
        width: '100vw',
        height: '100vh',
    },
};
