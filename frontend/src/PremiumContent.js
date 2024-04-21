import React from "react";
import { getUser, resetUserSession } from "./service/AuthService";

const PremiumContent = (props) => {
  const user = getUser();
  const username = user !== 'undefined' && user ? user.username : '';

  const handleLogout = () => {  
    resetUserSession();
    props.history.push("/login");
  };

  return (
    <div>
      <h1>Hello {username}! Welcome to Tezda</h1>
      <input type="button" value="Logout" onClick={handleLogout} />
    </div>
  );
};

export default PremiumContent;
