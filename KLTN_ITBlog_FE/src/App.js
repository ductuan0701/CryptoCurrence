import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Layout from "./layouts/Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackToTop from "./layouts/User/BackToTop";
import Loading from "./layouts/User/Loading";

const App = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Layout />
          <BackToTop />
          <ToastContainer />
        </>
      )}
    </Router>
  );
};

export default App;
