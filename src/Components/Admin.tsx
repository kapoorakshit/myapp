import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Nav from './Nav';
import Image from './Image';
import Delete from './Delete';
import Update from './Update';

interface Product {
  id: number;
  pTitle: string;
  pDescription: string;
  price: number;
  stock: number;
}

const Admin: React.FC = () => {
  const role = localStorage.getItem('userRoles');
  const token = localStorage.getItem('token');
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        console.log("yes");
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

  const formik = useFormik({
    initialValues: {
      pTitle: '',
      pDescription: '',
      price: 0,
      stock: 0,
    },
    validationSchema: Yup.object({
      pTitle: Yup.string().required('Title is required'),
      pDescription: Yup.string().required('Description is required'),
      price: Yup.number().required('Price is required').positive('Price must be positive'),
      stock: Yup.number().required('Stock is required').positive('Stock must be positive'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          'https://localhost:7008/api/Order/AddProduct',
          values,
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
    },
  });

  return (
    <div>
      <Nav role={role} />
      <h2 style={{ textAlign: 'center', color: 'green' }}>PRODUCTS</h2>

      {/* Create Button */}
      <button
        type="button"
        onClick={openModal}
        style={{ backgroundColor: 'green', color: 'white', padding: '10px', borderRadius: '5px', cursor: 'pointer', textAlign: 'center', marginLeft: '50vw' }}
      >
        Create Product
      </button>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0.5, 0,0.5)',
          },
          content: {
            width: '50%',
            height: '75%',
            margin: 'auto',
          },
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={closeModal}>
            close
          </button>
        </div>
        <h2 style={{ color: 'green', textAlign: 'center' }}>Create Product</h2>
        <form onSubmit={formik.handleSubmit} style={{ maxWidth: '400px', margin: 'auto', padding: '10px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '16px' }}>Title:</label>
            <input
              type="text"
              name="pTitle"
              value={formik.values.pTitle}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{ width: '100%', padding: '8px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            {formik.touched.pTitle && formik.errors.pTitle ? (
              <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.pTitle}</div>
            ) : null}
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '16px' }}>Description:</label>
            <input
              type="text"
              name="pDescription"
              value={formik.values.pDescription}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{ width: '100%', padding: '8px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            {formik.touched.pDescription && formik.errors.pDescription ? (
              <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.pDescription}</div>
            ) : null}
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '16px' }}>Price:</label>
            <input
              type="number"
              name="price"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{ width: '100%', padding: '8px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            {formik.touched.price && formik.errors.price ? (
              <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.price}</div>
            ) : null}
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '16px' }}>Stock:</label>
            <input
              type="number"
              name="stock"
              value={formik.values.stock}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{ width: '100%', padding: '8px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            {formik.touched.stock && formik.errors.stock ? (
              <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.stock}</div>
            ) : null}
          </div>
          <button
            type="submit"
            style={{ backgroundColor: 'green', color: 'white', padding: '10px', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}
          >
            Create
          </button>
        </form>
      </Modal>

      {/* Product List */}
      <ul>
        {products.map((product) => (
          <ProductDetail key={product.id} product={product} />
        ))}
      </ul>
    </div>
  );
};

const ProductDetail: React.FC<{ product: Product }> = ({ product }) => (
  <div style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '10px' }}>
    <h3>{product.pTitle}</h3>
    <p>Price: {product.price}</p>
    <p>Stock: {product.stock}</p>
    <Image productid={product.id} />
    <Delete productid={product.id} />
    <Update productid={product.id} />
  </div>
);

export default Admin;
