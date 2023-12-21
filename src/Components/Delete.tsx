import React, { useState } from "react";


interface DeleteProps {
  productid: number;
}

function Delete({ productid }: DeleteProps) {
    const token=localStorage.getItem('token');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = () => {

    fetch(`https://localhost:7008/api/Order/Delete/${productid}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Item deleted successfully", data);
                                                                                                                                                                          window.location.reload();
     
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
        
      });
      ;

    closeModal();
  };

  return (
    <div>
      <button className="delete" style={{ backgroundColor: 'red' }} onClick={openModal}>
        Delete
      </button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-content">
              <p>Are you sure you want to delete?</p>
              <button onClick={handleDelete}>Yes</button>
              <button onClick={closeModal}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Delete;
