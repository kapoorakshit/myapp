import React, { useState, useEffect } from "react";

interface UpdateProps {
  productid: number;
}

interface ProductData {
  [key: string]: string | number;
}

function Update({ productid }: UpdateProps) {
  const [data, setData] = useState<ProductData>({});
  const [formData, setFormData] = useState<ProductData>({});
  
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://localhost:7008/api/Order/GetById/${productid}`);
        const result = await response.json();
        console.log(result);
        setData(result);
        setFormData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [productid]);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`https://localhost:7008/api/Order/Update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Update successful');
                                                                                                                                                                window.location.reload();
        
        closeModal();
      } else {
        console.error('Update failed');
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  return (
    <div>
      <button className="update" style={{ backgroundColor: 'green' }} onClick={openModal}>
        Update
      </button>

      {isModalOpen && data && (
        <div className="modal-overlays">
          <div className="modals update-modal">
            <div className="modal-contents">
              <span className="close" onClick={closeModal}>&times;</span>
              <div>
                <h2 style={{ color: 'green', textAlign: 'center' }}>Update Product</h2>
                <form className="update-form">
                  {Object.keys(data).map((key) => (
                    <div key={key}>
                      <label>{key}:</label><br/>
                      <input
                        type={key === "price" || key === "stock" ? "number" : "text"}
                        name={key}
                        value={(formData as any)[key] || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  ))}
                  <button type="button" onClick={handleUpdate}>
                    Update
                  </button>
                  <button type="button" onClick={closeModal}>
                    Cancel
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

export default Update;

