import React from "react";
import { getLastString } from "../pages/Shop";

const ProductCard = ({ product, handleAddToCart, isInCart }) => {
  const imageUrl =
    getLastString(product.imageUrl) !== "Not_Available"
      ? product.imageUrl
      : "https://via.placeholder.com/150";

  return (
    <div className="product" key={product.productId.value}>
      <div className="product-img">
        <img src={imageUrl} alt={product.imageUrl} />
      </div>
      <div className="text-center">
        <p>{product.name}</p>
      </div>
      <div className="w-100 justify-content-center text-center">
        {product.subtitle !== "" ? (
          <div className="subtitle">{product.subtitle}</div>
        ) : (
          <div></div>
        )}
      </div>
      <div className="text-center">
        <p>$ {product.price}</p>
      </div>
      {isInCart(product.productId.value) ? (
        <button type="button" className="btn btn-incart w-100">
          <span>Added To Cart</span>
        </button>
      ) : (
        <button
          type="button"
          className="btn btn-cart w-100"
          onClick={() => handleAddToCart(product)}
        >
          <span className="plus">+</span>
          <span>Add to Cart</span>
        </button>
      )}
    </div>
  );
};
export default ProductCard;
