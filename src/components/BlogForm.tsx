import { Form, Formik } from 'formik'
import * as yup from 'yup'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle'

import FormikTextField from './FormikTextField'

const initialValues = {
  name: '',
}

const schema = yup.object({
  name: yup.string().required('Name is required'),
})

type BlogFormProps = {
  open: boolean
  onSubmit: (params: {name: string}) => void
  onClose: () => void
}

export default function BlogForm({open, onClose, onSubmit}: BlogFormProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add a blog</DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={onSubmit}
      >
        <Form noValidate>
          <DialogContent>
            <FormikTextField
              name="name"
              label="Blog name"
              sx={{width: '300px'}}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit">Submit</Button>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  )
}
