import React, { useState, useEffect } from "react";

interface OrderProps {
  productid: number;
}

interface ProductData {
  id: number;
  pTitle: string;
  price: number;
  quantity: number;
  dateOrdered: string;
  totalprice: number;
  userId: string;
}
  // Prepare the data for the POST request

function Order({ productid }: OrderProps) {
  var userId = localStorage.getItem('userData');

  const [data, setData] = useState<ProductData>({
    id: 0,
    pTitle: "",
    price: 0,
    quantity: 0,
    dateOrdered: "",
    totalprice: 0,
    userId: "",
  });
  const [editableQuantity, setEditableQuantity] = useState<number>(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://localhost:7008/api/Order/GetById/${productid}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }
        const result = await response.json();
        console.log(result);
        setData(result);
        setEditableQuantity(result.quantity); // Initialize editableQuantity with the initial value of quantity
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage("error in fetching data");
      }
    };

    fetchData();
  }, [productid]);
  // Prepare the data for the POST request
  const openModal = () => {
    setModalOpen(true);
  };
  // Prepare the data for the POST request
  const closeModal = () => {
    setModalOpen(false);
    setErrorMessage(null); // Clear the error message when closing the modal
  };
  // Prepare the data for the POST request
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10) || 0;
    setEditableQuantity(newQuantity);
  };
    // Prepare the data for the POST request

  const handleUpdate = async () => {
    try {
      const totalPrice = data.price * (editableQuantity !== undefined ? editableQuantity : 0);

      // Prepare the data for the POST request
      const postData = {
        orderId: 0,
        userId: userId || "",
        productId: data.id,
        ptitle: data.pTitle,
        price: data.price,
        quantity: editableQuantity,
        dateOrdered: new Date().toISOString(),
        totalprice: totalPrice,
      };

      const response = await fetch("https://localhost:7008/api/Order/PlaceOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {

   // Prepare the data for the POST request
    // Prepare the data for the POST request


        // console.log("Order placed successfully");

                                                                                                                                          window.location.reload();
        console.log("Order placed successfully");
        closeModal();
      } else {
        // If the response is not OK, throw an error
        throw new Error(`Failed to place order. Status: ${response.status}`);
      }
    } catch (error) {
      // Handle the error here
      console.error("Error placing order:", error);

      // Display an error message to the user
      setErrorMessage("quantity should be less than stock!!!!!!");
    }
  };

  return (
    <div>
      <button className="update" style={{ backgroundColor: 'green' }} onClick={openModal}>
        AddToCart
      </button>

      {isModalOpen && (
        <div className="modal-overlays">
          <div className="modals update-modal">
            <div className="modal-contents">
              <span className="close" onClick={closeModal}>&times;</span>
              <div>
                <h2 style={{ color: 'green', textAlign: 'center' }}>Place Order</h2>
                {errorMessage && <div style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</div>}
                <form className="order-form">
                  <div>
                    <label>Title:</label>
                    <span>{data.pTitle}</span>
                  </div>
                  <div>
                    <label>Price:</label>
                    <span>{data.price}</span>
                  </div>
                  <div>
                    <label>Quantity:</label>
                    <input
                      type="number"
                      value={editableQuantity}
                      onChange={handleQuantityChange}
                    />
                  </div>
                  <div>
                    <label>Date Ordered:</label>
                    <span>{new Date().toISOString()}</span>
                  </div>
                  <div>
                    <label>Total Price:</label>
                    <span>{data.price * (editableQuantity !== undefined ? editableQuantity : 0)}</span>
                  </div>

                  <button type="button" onClick={handleUpdate}>
                    AddToCart
                  </button>
                  <button type="button" onClick={closeModal}>
                    Close
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Order;

 // Prepare the data for the POST request
  // Prepare the data for the POST request
   // Prepare the data for the POST request
    // Prepare the data for the POST request
