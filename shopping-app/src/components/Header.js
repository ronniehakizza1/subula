import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";

// Images
import Logo from "../images/logo.png";
import Dot from "../images/dot.png";
import Recipes from "../images/recipes.svg";
import Place from "../images/shop.svg";

export default function Header() {
  const { logOut, user } = useUserAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  const imageUrl =
  user && user.photoURL? user.photoURL
    : "https://via.placeholder.com/150";

  return (
    <div className="p-2">
      <nav className="top-nav">
        <Link to="/"><img src={Logo} alt="" className="nav-img" /></Link>
        <div className="nav-icons-container">
          {user && (
            <>
              <Link to="/shop" className="nav-icon">
                <div className="d-flex w-100">
                  <img src={Place} alt="" className="nav-icon-img" />
                </div>
                <div className="l-h-0">
                  <small>Shop</small>
                </div>
              </Link>
              <Link to="/past-orders" className="nav-icon">
                <div className="d-flex w-100">
                  <img src={Recipes} alt="" className="nav-icon-img" />
                </div>
                <div className="l-h-0">
                  <small>Orders</small>
                </div>
              </Link>
              <Link to="/" className="nav-icon">
                <div className="d-flex w-100 position-relative">
                  <img
                    src={imageUrl}
                    alt={user.email}
                    className="nav-icon-img rounded"
                  />
                  <img
                    src={Dot}
                    alt=""
                    className="dot"
                    width="10"
                    height="10"
                  />
                </div>
                <div className="l-h-0 text-center">
                  <div className="pb-1">
                    {" "}
                    <small>Horray</small>
                  </div>
                  <div>
                    {" "}
                    <small>{user.email}</small>
                  </div>
                </div>
              </Link>
            </>
          )}

          {user && (
            <button
              className="btn btn-danger rounded-pill px-3"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}

          {!user && (
            <Link to="/signup">
              <button className="btn btn-light_ btn-outline-secondary rounded-pill px-3 mx-2">
                SignUp
              </button>
            </Link>
          )}

          {!user && (
            <Link to="/login">
              <button className="btn btn-success rounded-pill px-3">
                Login
              </button>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
