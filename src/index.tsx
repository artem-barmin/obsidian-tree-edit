import { FunctionComponent, render } from 'preact';
import { applyMiddleware, createStore } from 'redux';
import { rootReducer } from './redux/rootReducer';
import { App } from './components/App';
import { IMainProvider_Props } from './interfaces';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

const store = createStore(rootReducer, applyMiddleware(thunk));

export const preactRender = (HTMLElem: HTMLDivElement, markdownText: string, fileName: string) => {
  const MainProvider: FunctionComponent<IMainProvider_Props> = ({ store, markdown }) => {
    return (
      <>
        <Provider store={store}>
          <App markdownText={markdown} fileName={fileName} />
        </Provider>
      </>
    );
  };

  render(<MainProvider store={store} markdown={markdownText} />, HTMLElem);
};
