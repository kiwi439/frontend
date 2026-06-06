import React, { Fragment } from 'react';
import './styles/style.scss';
import useSetAuthInitialState from 'hooks/useSetAuthInitialState';
import TopBar from 'layouts/topBar/TopBar';
import AppRouter from 'pages/AppRouter';
import Newsletter from 'layouts/Newsletter';
import Footer from 'layouts/Footer';

const App = () => {
  useSetAuthInitialState();

  return (
    <Fragment>
      <TopBar />
      <div className="app-main-container">
        <AppRouter />
        <Newsletter />
      </div>
      <Footer />
    </Fragment>
  );
};

export default App;
