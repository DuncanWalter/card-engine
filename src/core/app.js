import { Module, loadModules } from './module'

import { base } from './../base/base'

export const global = loadModules([base]);
export const App = () => <div style={styles.app} id='app-root'>
   { global.render() }
</div>;

const styles = {
    app: {
        width: '100vw',
        height: '100vh',
    },
};
