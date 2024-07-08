import React, { Fragment, useEffect, useState } from "react";
import Header from "../components/Header";
import { useUserAuth } from "../context/UserAuthContext";
import { firestore } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Spinner } from "react-bootstrap";

export default function PastOrders() {
  const { user } = useUserAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUserOrders = async (id) => {
    try {
      const ordersRef = collection(firestore, "orders");
      const userOrdersQuery = where("userId", "==", id);
      const querySnapshot = await getDocs(query(ordersRef, userOrdersQuery));

      const ordersData = [];
      querySnapshot.forEach((doc) => {
        const order = doc.data();
        order.id = doc.id;
        ordersData.push(order);
      });

      setLoading(false);
      return setOrders(ordersData);
    } catch (error) {
      setLoading(false);
      return;
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      const orderRef = doc(firestore, "orders", orderId);
      setLoading(true);
      await deleteDoc(orderRef);
      alert("Order deleted successfully!");

      // After deletion, you may want to refresh the orders list
      if (user && user.uid) {
        getUserOrders(user.uid);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
    );
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return date.toLocaleString(undefined, options);
  };

  const formatMoney = (amount) => {
    const parts = amount.toString().split(".");
    const wholePart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const formattedAmount =
      parts.length === 2 ? `${wholePart}.${parts[1]}` : wholePart;
    return formattedAmount;
  };

  useEffect(() => {
    if (user && user.uid) {
      getUserOrders(user.uid);
    }
  }, [user]);

  return (
    <div>
      <Header />
      <div className="container-fluid">
        <div>
          <h4>Your past Orders</h4>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">ID</th>
              <th scope="col">Billing Name</th>
              <th scope="col">Billing Phone Number</th>
              <th scope="col">Items</th>
              <th scope="col">Status</th>
              <th scope="col">Date Created</th>
              <th scope="col">Total Amount</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="text-center" colSpan={9}>
                  <Spinner className="mx-auto text-warning text-center" />
                </td>
              </tr>
            ) : (
              <>
                {orders.length > 0 ? (
                  <>
                    {orders.map((order, i = 1) => {
                      return (
                        <tr key={i}>
                          <th scope="row">{i}</th>
                          <td>{order.id}</td>
                          <td>{order.billingName}</td>
                          <td>{order.billingPhoneNumber}</td>
                          <td>
                            {order.cartItems.map((item) => {
                              return (
                                <Fragment key={item.productId.value}>
                                  <>
                                    <img
                                      src={item.imageUrl}
                                      width={40}
                                      alt={item.imageUrl}
                                    />
                                    <>{item.name}</>
                                    <br />
                                  </>
                                  <hr className="my-0" />
                                </Fragment>
                              );
                            })}
                          </td>
                          <td>{order.status}</td>
                          <td>{formatTimestamp(order.createdAt)}</td>
                          <td>${formatMoney(order.totalPriceCounter)}</td>
                          <td>
                            <button
                              className="btn btn-danger rounded"
                              onClick={() => deleteOrder(order.id)}
                            >
                              Delete Order
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </>
                ) : (
                  <tr>
                    <th scope="row" colSpan={9} className="text-center">
                      You have not placed any orders yet
                    </th>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
