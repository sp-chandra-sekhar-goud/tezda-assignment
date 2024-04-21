import { BrowserRouter, NavLink, Route, Switch } from "react-router-dom";
import Home from "./Home";
import Register from "./Register";
import Login from "./Login";
import PremiumContent from "./PremiumContent";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import { useEffect, useState } from "react";
import { getToken, getUser, resetUserSession, setUserSession } from "./service/AuthService";
import axios from "axios";

const verifyTokenAPIUrl = "https://g4xzwk108c.execute-api.ap-south-1.amazonaws.com/prod/verify";


function App() {

  const [authenticating, setAuthenticating] = useState(true);

  useEffect(() => {
    const token = getToken();
    if(token === 'undefined' || token === null || token === undefined || !token) {
      return;
    }
    const requestConfig = {
      headers: {
        "x-api-key": "q4Z9pvtG4V295PQEPoZ0P8CIghGkEZ5A5egAFymg",
      },
    };

    const requestBody = {
      user: getUser(),
      token: token,
    };

    axios.post(verifyTokenAPIUrl, requestBody, requestConfig).then((response) => {
      setUserSession(response.data.user, response.data.token);
      setAuthenticating(false);
     }).catch((error) => {
      resetUserSession();
      setAuthenticating(false);
    });

  }, []);


  const token = getToken();
  if(authenticating && token) { 
    return (
      <div className="content">
        <h1>Authenticating...</h1>
      </div>
    );}

  return (
    <div className="App">
      <BrowserRouter>
        <div className="header">
          <NavLink exact activeClassName="active" to="/">
            Home
          </NavLink>
          <NavLink activeClassName="active" to="/register">
            Register
          </NavLink>
          <NavLink activeClassName="active" to="/login">
            Login
          </NavLink>
          <NavLink activeClassName="active" to="/premium-content">
            Premium Content
          </NavLink>
        </div>
        <div className="content">
          <Switch>
            <Route exact path="/" component={Home} />
            <PublicRoute path="/register" component={Register} />
            <PublicRoute path="/login" component={Login} />
            <PrivateRoute path="/premium-content" component={PremiumContent} />
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
