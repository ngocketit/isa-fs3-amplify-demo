import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { CognitoUserAmplify } from '@aws-amplify/ui'

type AppbarProps = {
  signOut: () => void
  user?: CognitoUserAmplify,
}

export default function Appbar({signOut, user}: AppbarProps) {
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {`Welcome: ${user?.username}`}
        </Typography>
        <Button color="inherit" onClick={signOut}>Logout</Button>
      </Toolbar>
    </AppBar>
  )
}
