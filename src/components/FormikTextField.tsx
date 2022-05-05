import TextField, { TextFieldProps } from '@mui/material/TextField'
import { useField } from 'formik'

type FormikTextFieldProps = {
  name: string
} & TextFieldProps

export default function FormikTextField({name, helperText, ...rest}: FormikTextFieldProps) {
  const [field, meta] = useField(name)

  return (
    <TextField
      error={meta.touched && Boolean(meta.error)}
      helperText={helperText || (meta.touched && meta.error)}
      {...field}
      {...rest}
    />
  )
}

