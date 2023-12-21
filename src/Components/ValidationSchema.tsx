// validationSchema.ts
import * as yup from 'yup';

const ValidationSchema = yup.object().shape({
  pTitle: yup.string().required('Title is required'),
  pDescription: yup.string().required('Description is required'),
  price: yup.number().required('Price is required').positive('Price must be positive'),
  stock: yup.number().required('Stock is required').positive('Stock must be positive'),
});

export default ValidationSchema;
