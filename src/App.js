import React from 'react';
import './App.css';
import Grid from '@material-ui/core/Grid';
import Header from './components/Header/index';
import SearchBar from './components/SearchBar/index';
import BoardGameList from './components/BoardGameList/index';
import FriendsList from './components/FriendsList/index';
import BoardGamePreview from './components/BoardGamePreview/index';
import BoardGameDescription from './components/BoardGameDescription/index';
import Links from './components/ExternalLinks/index';

function App() {
  return (
    <div className="App">
      <Header />
      <SearchBar />
      <Grid container spacing={2}>
        <Grid item xs={3} >
          <BoardGameList />
        </Grid>

        <Grid item xs={6} >
          <BoardGamePreview />
          <BoardGameDescription />
        </Grid>

        <Grid item xs={3} >
          <FriendsList />
          <Links />
        </Grid>
      </Grid>
 
    </div>
  );
}

export default App;