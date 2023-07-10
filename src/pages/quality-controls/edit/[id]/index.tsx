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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getQualityControlById, updateQualityControlById } from 'apiSdk/quality-controls';
import { Error } from 'components/error';
import { qualityControlValidationSchema } from 'validationSchema/quality-controls';
import { QualityControlInterface } from 'interfaces/quality-control';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ManufacturerInterface } from 'interfaces/manufacturer';
import { UserInterface } from 'interfaces/user';
import { getManufacturers } from 'apiSdk/manufacturers';
import { getUsers } from 'apiSdk/users';

function QualityControlEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<QualityControlInterface>(
    () => (id ? `/quality-controls/${id}` : null),
    () => getQualityControlById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: QualityControlInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateQualityControlById(id, values);
      mutate(updated);
      resetForm();
      router.push('/quality-controls');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<QualityControlInterface>({
    initialValues: data,
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
            Edit Quality Control
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(QualityControlEditPage);
