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
import { createQualityControl } from 'apiSdk/quality-controls';
import { Error } from 'components/error';
import { qualityControlValidationSchema } from 'validationSchema/quality-controls';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ManufacturerInterface } from 'interfaces/manufacturer';
import { UserInterface } from 'interfaces/user';
import { getManufacturers } from 'apiSdk/manufacturers';
import { getUsers } from 'apiSdk/users';
import { QualityControlInterface } from 'interfaces/quality-control';

function QualityControlCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: QualityControlInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createQualityControl(values);
      resetForm();
      router.push('/quality-controls');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<QualityControlInterface>({
    initialValues: {
      status: '',
      comments: '',
      manufacturer_id: (router.query.manufacturer_id as string) ?? null,
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: qualityControlValidationSchema,
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
            Create Quality Control
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="status" mb="4" isInvalid={!!formik.errors?.status}>
            <FormLabel>Status</FormLabel>
            <Input type="text" name="status" value={formik.values?.status} onChange={formik.handleChange} />
            {formik.errors.status && <FormErrorMessage>{formik.errors?.status}</FormErrorMessage>}
          </FormControl>
          <FormControl id="comments" mb="4" isInvalid={!!formik.errors?.comments}>
            <FormLabel>Comments</FormLabel>
            <Input type="text" name="comments" value={formik.values?.comments} onChange={formik.handleChange} />
            {formik.errors.comments && <FormErrorMessage>{formik.errors?.comments}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<ManufacturerInterface>
            formik={formik}
            name={'manufacturer_id'}
            label={'Select Manufacturer'}
            placeholder={'Select Manufacturer'}
            fetcher={getManufacturers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
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

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'quality_control',
    operation: AccessOperationEnum.CREATE,
  }),
)(QualityControlCreatePage);
