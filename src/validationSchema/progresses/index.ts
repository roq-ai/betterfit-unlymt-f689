import * as yup from 'yup';

export const progressValidationSchema = yup.object().shape({
  workouts_completed: yup.number().integer().required(),
  dietary_changes_made: yup.number().integer().required(),
  user_id: yup.string().nullable(),
});
