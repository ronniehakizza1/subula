import React from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";

export default function Landing () {
  return (
    <div>
      <Header />
      <div className="landing">
        <div className="w-100">
          <div className="py-5">
            <h1 className="display-1 text-center text-white py-5 mt-5">
              Welcome to Subula Shopping App
            </h1>
          </div>
          <div className="d-flex w-100">
            <Link to="/login" className="mx-auto">
              <button className="btn btn-success rounded px-5 py-2">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
