import React, { useState, useEffect } from "react";
import Nav from "./Nav";

interface CartItem {
  orderId: number;
  userId: string;
  productId: number;
  ptitle: string;
  price: number;
  quantity: number;
  dateOrdered: string;
  totalprice: number;
}

const Cart: React.FC = () => {
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const role = localStorage.getItem('userRoles');
  const userId = localStorage.getItem('userData');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://localhost:7008/api/Order/Getorderbyid/${userId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: CartItem[] = await response.json();
        setCartData(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching cart data:", error);
        setError("Error fetching cart data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div className="cart-container">
      <Nav role={role} />
      <h2 className="cart-title">Your Cart</h2>

      {loading && <p>Loading...</p>}

      {error && <p className="error-message">{error}</p>}

      {!loading && !error && cartData.length === 0 ? (
        <p>No items in the cart.</p>
      ) : (
        <ul className="cart-list">
          {cartData.map((item) => (
            <CartItemComponent key={item.orderId} item={item} />
          ))}
        </ul>
      )}
    </div>
  );
};

interface CartItemProps {
  item: CartItem;
}
const CartItemComponent: React.FC<CartItemProps> = ({ item }) => (
    <li className="cart-card">
      <div className="card-content">
        <p className="item-title">{item.ptitle}</p>
        <p className="price">Price: ${item.price}</p>
        <p className="quantity">Quantity: {item.quantity}</p>
        <p className="date-ordered">Date Ordered: {item.dateOrdered}</p>
        <p className="total-price">Total Price: ${item.totalprice}</p>
      </div>
    </li>
  );
export default Cart;
