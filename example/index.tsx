import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ProductPage } from './ProductPage';
import { ArrayParamPage } from './ArrayParamPage';
import { IndexPage } from './IndexPage';
import { Links } from './Links';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={Links.Product.route} element={<ProductPage />} />
        <Route path={Links.Array.route} element={<ArrayParamPage />} />
        <Route path={'*'} element={<IndexPage />} />
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
