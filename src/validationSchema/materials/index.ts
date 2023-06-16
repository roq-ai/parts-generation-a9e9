import * as yup from 'yup';

export const materialValidationSchema = yup.object().shape({
  finis_code: yup.string().required(),
  description: yup.string().required(),
  sourcing_provider: yup.string().required(),
  availability: yup.boolean().required(),
  company_id: yup.string().nullable(),
});
