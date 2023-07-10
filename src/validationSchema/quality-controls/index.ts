import * as yup from 'yup';

export const qualityControlValidationSchema = yup.object().shape({
  status: yup.string().required(),
  comments: yup.string(),
  manufacturer_id: yup.string().nullable(),
  user_id: yup.string().nullable(),
});
