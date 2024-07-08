import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { firestore } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useUserAuth } from "../context/UserAuthContext";
import rawProducts from "../data/products.json";

// Images
import Arrow from "../images/arrow.svg";
import Cart from "../images/cart.svg";
import ProductCard from "../components/ProductCard";
import CartCard from "../components/CartCard";
import FilterButton from "../components/FilterButton";
import Header from "../components/Header";

export const getLastString = (text) => {
  return text.substr(text.length - 13);
};

export default function Shop() {
  const [productsList, setProductsList] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [resultsCounter, setResultsCounter] = useState(0);
  const [cartCounter, setCartCounter] = useState(0);
  const [totalPriceCounter, setTotalPriceCounter] = useState(0);
  const [show, setShow] = useState(false);
  const [billingName, setBillingName] = useState("");
  const [billingPhoneNumber, setBillingPhoneNumber] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [orderError, setOrderError] = useState("");
  const [orderSuccessMsg, setOrderSuccessMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useUserAuth();
  const navigate = useNavigate();

  const handleClose = () => setShow(false);

  // let products = [];
  const products = useMemo(() => {
    let products = [];
    rawProducts.forEach((product) => {
      products.push({ ...product, amount: 0 });
    });
    return products;
  }, []);

  rawProducts.map((product) => {
    return products.push({ ...product, amount: 0 });
  });

  useEffect(() => {
    setProductsList(products);
    setResultsCounter(products.length);
    setLoading(false);
  }, [products, setProductsList, setResultsCounter]);

  const handleAddToCart = (clickedProduct) => {
    let prev = [...cartItems];
    let isProductInCart = prev.find(
      (product) => product.productId.value === clickedProduct.productId.value
    );
    if (isProductInCart) {
      isProductInCart.amount++;
    } else {
      prev = [...prev, { ...clickedProduct, amount: 1 }];
    }
    handleCartCounter(prev);
    handleTotalPriceCounter(prev);
    setCartItems(prev);
  };

  const handleRemoveFromCart = (id) => {
    let prev = [...cartItems];
    let isProductInCart = prev.find(
      (product) => product.productId.value === id
    );

    if (isProductInCart) {
      if (isProductInCart.amount < 2) {
        const index = prev.indexOf(isProductInCart);
        prev.splice(index, 1);
      } else {
        isProductInCart.amount--;
      }
      handleCartCounter(prev);
      handleTotalPriceCounter(prev);
      setCartItems(prev);
    }
  };

  const isInCart = (id) => {
    const isPresentInCart = cartItems.find(
      (product) => product.productId.value === id
    );
    if (isPresentInCart) {
      return true;
    } else {
      return false;
    }
  };

  const handleCartCounter = (items) => {
    const total = items.reduce((acc, curr) => acc + curr.amount, 0);
    return setCartCounter(total);
  };

  const handleTotalPriceCounter = (items) => {
    const total = items.reduce(
      (acc, curr) => acc + curr.amount * curr.price,
      0
    );
    return setTotalPriceCounter(total);
  };
  const renderProducts = () => {
    return productsList.map((product, key) => {
      return (
        <ProductCard
          key={key}
          product={product}
          handleAddToCart={handleAddToCart}
          isInCart={isInCart}
        />
      );
    });
  };

  const renderCartItems = () => {
    if (cartItems.length < 1) {
      return <div className="w-100 text-center">Your Cart is Empty</div>;
    }
    return cartItems.map((product) => {
      return (
        <CartCard
          key={product.productId.value}
          product={product}
          handleAddToCart={handleAddToCart}
          handleRemoveFromCart={handleRemoveFromCart}
        />
      );
    });
  };

  const renderTotalPrice = () => {
    if (cartItems.length < 1) {
      return <div className="w-100 text-center"></div>;
    }
    return (
      <div className="total-price">
        <h2>TOTAL </h2>
        <h2>${totalPriceCounter}</h2>
      </div>
    );
  };

  const handleFilter = (category) => {
    let results = [];
    if (category === "All") {
      setProductsList(products);
      setResultsCounter(products.length);
      return null;
    }
    products.map((product) => {
      if (product.category === category) {
        results.push(product);
      }
      return null;
    });
    setProductsList(results);
    setResultsCounter(results.length);
    return null;
  };

  const handleSubmitOrder = async () => {
    try {
      if (!billingName) return setOrderError("Please add a billing Name");
      if (!billingPhoneNumber)
        return setOrderError("Please add a billing Phone Number");
      if (!billingAddress) return setOrderError("Please add a billing Address");
      setOrderError("");
      setLoading(true);      

      const orderRef = await addDoc(collection(firestore, "orders"), {
        billingName,
        status: "PENDING",
        billingPhoneNumber,
        billingAddress,
        cartItems,
        totalPriceCounter,
        userId: user.uid,
        createdAt: new Date(),
      });
      setOrderSuccessMsg(
        `Your order has been successfully placed with order ID  # ${orderRef.id}`
      );

      // Optionally, you can reset the form or navigate to a confirmation page
      setBillingName("");
      setBillingPhoneNumber("");
      setBillingAddress("");
      setCartItems([]);
      setTotalPriceCounter(0);
      setCartCounter(0);

      setTimeout(() => {
        setLoading(false);
        setShow(false);
        setOrderSuccessMsg("");
        navigate("/past-orders")
      }, 5000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Header />
      <div className="container d-flex">
        <div className="body-container">
          <div>
            <div>Shop by Category</div>
            <div className="filters">
              <FilterButton text="Alcohol" handleFilter={handleFilter} />
              <FilterButton text="Bakery" handleFilter={handleFilter} />
              <FilterButton text="Dairy & Eggs" handleFilter={handleFilter} />
              <FilterButton text="Drinks" handleFilter={handleFilter} />
              <FilterButton text="Frozen" handleFilter={handleFilter} />
              <FilterButton text="Home & Health" handleFilter={handleFilter} />
              <FilterButton
                text="Meat, Fish & Protein"
                handleFilter={handleFilter}
              />
              <FilterButton text="Pantry" handleFilter={handleFilter} />
              <FilterButton text="Prepared" handleFilter={handleFilter} />
              <FilterButton text="Pet Products" handleFilter={handleFilter} />
              <FilterButton text="Prepared" handleFilter={handleFilter} />
              <FilterButton text="Produce" handleFilter={handleFilter} />
              <FilterButton text="Snacks" handleFilter={handleFilter} />
              <FilterButton text="All" handleFilter={handleFilter} />
            </div>
            <div className="text-muted">
              <small>
                <i>Showing {resultsCounter} results</i>
              </small>
            </div>
            <div className="products-container">{renderProducts()}</div>
          </div>
        </div>
        <div className="cart-container">
          <div className="cart-header">
            <span>
              <img
                src={Arrow}
                alt=""
                className="mx-auto"
                width="25"
                height="25"
              />
            </span>
            <span>Your Cart</span>
            <span className="position-relative">
              <div className="cart-counter">{cartCounter}</div>
              <img
                src={Cart}
                alt=""
                className="mx-auto"
                width="25"
                height="25"
              />
              <div className="w-100 text-center text-secondary">
                <small>Cart</small>
              </div>
            </span>
          </div>
          {renderCartItems()}
          {renderTotalPrice()}
          {cartItems && cartItems.length > 0 && (
            <div className="p-2">
              <button
                className="btn btn-dark rounded-pill w-100 my-2"
                onClick={() => setShow(true)}
              >
                CheckOut
              </button>
            </div>
          )}
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-100 bg-dark text-white rounded py-1">
            You are Checking Out
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {renderCartItems()}
          <Form>
            <h2 className="text-center text-muted bg-light mt-5 py-2">
              Please enter your billing Details
            </h2>
            <div className="form-group py-2">
              <label htmlForfor="fullNames">Full Names</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setBillingName(e.target.value)}
              />
            </div>
            <div className="form-group py-2">
              <label htmlForfor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                onChange={(e) => setBillingPhoneNumber(e.target.value)}
              />
            </div>
            <div className="form-group py-2">
              <label htmlForfor="billingAddress">Billing Address</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setBillingAddress(e.target.value)}
              />
            </div>
          </Form>
          {orderError && (
            <div className="alert alert-danger w-100 text-center">
              {orderError}
            </div>
          )}
          {orderSuccessMsg && (
            <div className="alert alert-success w-100 text-center">
              {orderSuccessMsg}
            </div>
          )}
          {loading ? (
            <div className="d-flex">
              {" "}
              <Spinner className="mx-auto text-warning" />{" "}
            </div>
          ) : (
            <div className="d-flex justify-content-between pt-5">
              <Button variant="light" onClick={handleClose}>
                Close
              </Button>
              <Button
                variant="dark"
                className="rounded"
                onClick={handleSubmitOrder}
              >
                Place Order
              </Button>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
