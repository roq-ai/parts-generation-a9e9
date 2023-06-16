import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createMaterial } from 'apiSdk/materials';
import { Error } from 'components/error';
import { materialValidationSchema } from 'validationSchema/materials';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { CompanyInterface } from 'interfaces/company';
import { getCompanies } from 'apiSdk/companies';
import { MaterialInterface } from 'interfaces/material';

function MaterialCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: MaterialInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createMaterial(values);
      resetForm();
      router.push('/materials');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<MaterialInterface>({
    initialValues: {
      finis_code: '',
      description: '',
      sourcing_provider: '',
      availability: false,
      company_id: (router.query.company_id as string) ?? null,
    },
    validationSchema: materialValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Material
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="finis_code" mb="4" isInvalid={!!formik.errors?.finis_code}>
            <FormLabel>Finis Code</FormLabel>
            <Input type="text" name="finis_code" value={formik.values?.finis_code} onChange={formik.handleChange} />
            {formik.errors.finis_code && <FormErrorMessage>{formik.errors?.finis_code}</FormErrorMessage>}
          </FormControl>
          <FormControl id="description" mb="4" isInvalid={!!formik.errors?.description}>
            <FormLabel>Description</FormLabel>
            <Input type="text" name="description" value={formik.values?.description} onChange={formik.handleChange} />
            {formik.errors.description && <FormErrorMessage>{formik.errors?.description}</FormErrorMessage>}
          </FormControl>
          <FormControl id="sourcing_provider" mb="4" isInvalid={!!formik.errors?.sourcing_provider}>
            <FormLabel>Sourcing Provider</FormLabel>
            <Input
              type="text"
              name="sourcing_provider"
              value={formik.values?.sourcing_provider}
              onChange={formik.handleChange}
            />
            {formik.errors.sourcing_provider && <FormErrorMessage>{formik.errors?.sourcing_provider}</FormErrorMessage>}
          </FormControl>
          <FormControl
            id="availability"
            display="flex"
            alignItems="center"
            mb="4"
            isInvalid={!!formik.errors?.availability}
          >
            <FormLabel htmlFor="switch-availability">Availability</FormLabel>
            <Switch
              id="switch-availability"
              name="availability"
              onChange={formik.handleChange}
              value={formik.values?.availability ? 1 : 0}
            />
            {formik.errors?.availability && <FormErrorMessage>{formik.errors?.availability}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<CompanyInterface>
            formik={formik}
            name={'company_id'}
            label={'Select Company'}
            placeholder={'Select Company'}
            fetcher={getCompanies}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'material',
  operation: AccessOperationEnum.CREATE,
})(MaterialCreatePage);
