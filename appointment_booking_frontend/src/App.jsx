import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes";

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <AppRoutes user={user} setUser={setUser} />
    </Router>
  );
}

export default App;