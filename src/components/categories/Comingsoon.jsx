import React from "react";
import { Link } from "react-router-dom";


const Comingsoon = () => {
    return (
      <>
        
        <div>
          <h1>Coming Soon</h1>
          <p>Stay tuned for updates!</p>
          <Link to="/">Back to Home</Link>
        </div>
      </>
    );
  };
  
  export default Comingsoon;