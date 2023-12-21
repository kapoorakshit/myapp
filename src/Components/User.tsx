import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Nav from './Nav';
import Image from './Image';
import Order from './Order';

interface Product {
  id: number;
  pTitle: string;
  pDescription: string;
  price: number;
  stock: number;
}

const User: React.FC = () => {
  const role = localStorage.getItem('userRoles');
  const token = localStorage.getItem('token');
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    id: 0,
    pTitle: '',
    pDescription: '',
    price: 0,
    stock: 0,
    images: ['', '', ''],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://localhost:7008/api/Order/GetProduct', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status !== 200) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = response.data;
        setProducts(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [token]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleCreateProduct = async () => {
    try {
      const response = await axios.post(
        'https://localhost:7008/api/Order/AddProduct',
        newProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setProducts((prevProducts) => [...prevProducts, response.data]);
      closeModal();
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };
  return (
    <div>
      <Nav role={role} />
      <div className="product-container">
        <h2 style={{textAlign: 'center'}}>PRODUCTS</h2>
        {/* <button className="create-product-btn" onClick={openModal}>
          Create Product
        </button> */}
        <div className="product-list">
          {products.map((product) => (
            <ProductDetail key={product.id} product={product} />
          ))}
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          content: {
            width: '50%',
            height: '75%',
            margin: 'auto',
          },
        }}
      >
        <div className="modal-header">
          <button className="close-btn" onClick={closeModal}>
            Close
          </button>
        </div>
        <h2>Create Product</h2>
        <form className="product-form">
         
          <button
            className="create-product-btn"
            type="button"
            onClick={handleCreateProduct}
          >
            Create
          </button>
        </form>
      </Modal>
    </div>
  );
};

const ProductDetail: React.FC<{ product: Product }> = ({ product }) => (
  <div className="product-detail">
    <h3>{product.pTitle}</h3>
    <p>Price: {product.price}</p>
    <p>Stock: {product.stock}</p>
    <Image productid={product.id} />
    <Order productid={product.id} />
  </div>
);

export default User;
