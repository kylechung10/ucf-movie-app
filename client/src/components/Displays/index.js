import React from "react";
import AccountDetails from "../AccountDetails";
import FavoriteMovies from "../FavoriteMovies";
import SearchMovies from "../SearchMovies";

// Swtitch statement
export default function Displays(props) {
  let component;
  const { display } = props;
  // Pass userlogin info through to the other components
  const { userLogin } = props;

  switch (display) {
    case "account":
      component = <AccountDetails username={userLogin} />;
      break;
    case "favorite":
      component = <FavoriteMovies username={userLogin} />;
      break;
    case "search":
      component = <SearchMovies username={userLogin} />;
      break;
    case "home":
      component = null;
      break;
    default:
      component = null;
      break;
  }

  return component;
}
