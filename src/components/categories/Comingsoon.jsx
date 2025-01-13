import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./components/Navbar"; 

const Comingsoon = () => {
    return (
      <>
        <Navbar />
        <div>
          <h1>Coming Soon</h1>
          <p>Stay tuned for updates!</p>
          <Link to="/">Back to Home</Link>
        </div>
      </>
    );
  };
  
  export default Comingsoon;