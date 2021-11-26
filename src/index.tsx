import { render } from 'preact';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';

import { rootReducer } from './redux/rootReducer';
import { App } from './components/App';
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
