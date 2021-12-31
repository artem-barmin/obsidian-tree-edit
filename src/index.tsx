import { configureStore } from '@reduxjs/toolkit';
import { render } from 'preact';
import { Provider } from 'react-redux';
import { App } from './components/App';
import { rootReducer } from './redux/reducers';
import TreeEditView from './treeEdit-view';

const store = configureStore({ reducer: rootReducer });

export const preactRender = (plugin: TreeEditView) => {
  render(
    <Provider store={store}>
      <App plugin={plugin} />
    </Provider>,
    plugin.mainDiv
  );
};
