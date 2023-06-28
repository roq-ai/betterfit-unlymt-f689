import * as yup from 'yup';

export const contentValidationSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string(),
  category: yup.string().required(),
  user_id: yup.string().nullable(),
});
