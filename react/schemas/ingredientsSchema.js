  
  import * as Yup from 'yup';

  const ingredientsSchema = Yup.object().shape({
      name: Yup.string()
      .required('Name is required')
      .min(2, 'Must be a minumum of 2 characters')
      .max(200, 'Maximum is 200 characters'),
      unitCost: Yup.number('Price is required')
      .min(0, 'Unit Cost Must be a minimum of 0' ),
      description: Yup.string()
      .min(2, 'Description must be a minumum of 2 characters')
      .max(500, 'Maximum of 500 characters'),
      imageUrl: Yup.string()
      .min(2, 'must be a minumum of 2 characters')
      .max(500, 'Maximum of 500 characters'),
      isInStock: Yup.string()
      .min(0, 'Must be a minimum of 0' ),
      isDeleted: Yup.string()
      .min(0, 'Must be a minimum of 0' ),
      quantity: Yup.number('Quantity is required')
      .min(0, 'Must be a minimum of 0' ),
      measure: Yup.string()
      .min(2, 'Must be a minumum of 2 characters')
      .max(200, 'Maximum 200 characters'),
  });
  export default ingredientsSchema;
  