import React from "react";
import { getLastString } from "../pages/Shop";


const CartCard = ({
	product,
	handleAddToCart,
	handleRemoveFromCart,
}) => {
	return (
		<div className="w-100 d-flex p-2 card-card">
			<span className="cart-img">
				{getLastString(product.imageUrl) !== "Not_Available" ? (
					<img src={product.imageUrl} alt="" />
				) : (
					<img src={`https://via.placeholder.com/100`} alt="" />
				)}
			</span>

			<div className="d-block">
				<div className="w-100">{product.name}</div>
				<div className="w-100 d-flex justify-content-between">
					<span>${product.price}</span>
					<span>Total : ${product.price * product.amount}</span>
				</div>
				<div className="w-100 d-flex justify-content-between">
					<span>
						<button
							className="btn"
							onClick={() => handleRemoveFromCart(product.productId.value)}
						>
							<span className="plus">-</span>
						</button>
					</span>
					<span>{product.amount}</span>
					<span>
						<button
							className="btn rounded"
							onClick={() => handleAddToCart(product)}
						>
							<span className="plus">+</span>
						</button>
					</span>
				</div>
			</div>
		</div>
	);
};
export default CartCard;
