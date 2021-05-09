import './App.css';
import { Route, Switch } from 'react-router-dom';
import { Router } from 'react-router';
import HomePage from './pages/homepage.page';
import SignInPage from './pages/signinpage.page'
import PrivateRoute from "./components/PrivateRoute.component";
const createHistory = require('history').createBrowserHistory;
const history = createHistory({ forceRefresh: true });




const App = () => {
  return (
      <Router history={history}>
        <Switch>
          <Route exact path={'/auth'} component={() =>  <SignInPage /> } />
          <PrivateRoute path={'/'} component={() => <HomePage />}/>
        </Switch>
      </Router>
  );
}

export default App;
