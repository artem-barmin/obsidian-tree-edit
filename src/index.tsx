import { render } from 'preact';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { App } from './components/App';
import { rootReducer } from './redux/reducers';
import TreeEditView from './treeEdit-view';

const store = createStore(rootReducer, applyMiddleware(thunk));

export const preactRender = (plugin: TreeEditView) => {
  render(
    <Provider store={store}>
      <App plugin={plugin} />
    </Provider>,
    plugin.mainDiv
  );
};
