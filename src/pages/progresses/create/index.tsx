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
import { createProgress } from 'apiSdk/progresses';
import { Error } from 'components/error';
import { progressValidationSchema } from 'validationSchema/progresses';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { ProgressInterface } from 'interfaces/progress';

function ProgressCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: ProgressInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createProgress(values);
      resetForm();
      router.push('/progresses');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<ProgressInterface>({
    initialValues: {
      workouts_completed: 0,
      dietary_changes_made: 0,
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: progressValidationSchema,
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
            Create Progress
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="workouts_completed" mb="4" isInvalid={!!formik.errors?.workouts_completed}>
            <FormLabel>Workouts Completed</FormLabel>
            <NumberInput
              name="workouts_completed"
              value={formik.values?.workouts_completed}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('workouts_completed', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.workouts_completed && (
              <FormErrorMessage>{formik.errors?.workouts_completed}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl id="dietary_changes_made" mb="4" isInvalid={!!formik.errors?.dietary_changes_made}>
            <FormLabel>Dietary Changes Made</FormLabel>
            <NumberInput
              name="dietary_changes_made"
              value={formik.values?.dietary_changes_made}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('dietary_changes_made', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.dietary_changes_made && (
              <FormErrorMessage>{formik.errors?.dietary_changes_made}</FormErrorMessage>
            )}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
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
  entity: 'progress',
  operation: AccessOperationEnum.CREATE,
})(ProgressCreatePage);
