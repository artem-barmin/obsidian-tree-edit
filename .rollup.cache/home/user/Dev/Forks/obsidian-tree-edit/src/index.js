import { jsx as _jsx } from "preact/jsx-runtime";
import { render } from 'preact';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { App } from './components/App';
import { rootReducer } from './redux/reducers';
const store = createStore(rootReducer, applyMiddleware(thunk));
export const preactRender = (plugin) => {
    render(_jsx(Provider, { store: store, children: _jsx(App, { plugin: plugin }, void 0) }, void 0), plugin.mainDiv);
};
//# sourceMappingURL=index.js.map