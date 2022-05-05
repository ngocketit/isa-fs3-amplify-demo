import { Form, Formik } from 'formik'
import * as yup from 'yup'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

import FormikTextField from './FormikTextField'

const initialValues = {
  comment: '',
}

const schema = yup.object({
  comment: yup.string().required('Name is required'),
})

type FormSubmitValue = {
  comment: string
}

type CommentFormProps = {
  onSubmit: (params: FormSubmitValue) => void
}

export default function CommentForm({onSubmit}: CommentFormProps) {
  const handleSubmit = (values: FormSubmitValue, {resetForm}: any) => {
    onSubmit(values)
    resetForm()
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={handleSubmit}
    >
      <Form noValidate>
        <Box sx={{mb: 2}}>
          <FormikTextField
            name="comment"
            label="Comment"
            sx={{width: '600px'}}
            multiline
            rows={3}
            required
          />
        </Box>
        <Button variant="outlined" type="submit">Submit</Button>
      </Form>
    </Formik>
  )
}
