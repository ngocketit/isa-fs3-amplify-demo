import { Form, Formik } from 'formik'
import * as yup from 'yup'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import FormikTextField from './FormikTextField'

const initialValues = {
  title: '',
  content: '',
}

const schema = yup.object({
  title: yup.string().required('Title is required'),
  content: yup.string().required('Title is required'),
})

type PostFormProps = {
  open: boolean
  onSubmit: (params: {title: string, content: string}) => void
  onClose: () => void
}

export default function PostForm({open, onClose, onSubmit}: PostFormProps) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Toolbar />
      <Stack direction="column" spacing={2} sx={{padding: 2}}>
        <Typography variant="h6">Add a new post</Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={onSubmit}
        >
          <Form noValidate>
            <Stack direction="column" spacing={2}>
              <FormikTextField
                name="title"
                label="Title"
                sx={{width: '350px'}}
                required
              />
              <FormikTextField
                name="content"
                label="Content"
                sx={{width: '350px'}}
                multiline
                rows={5}
                required
              />
              <Button type="submit" variant="contained">Submit</Button>
            </Stack>
          </Form>
        </Formik>
      </Stack>
    </Drawer>
  )
}
