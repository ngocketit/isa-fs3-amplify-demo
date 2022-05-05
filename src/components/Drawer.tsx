import MuiDrawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import FolderIcon from '@mui/icons-material/Folder'
import DeleteIcon from '@mui/icons-material/Delete'
import { useNavigate, useLocation } from 'react-router-dom'
import Button from '@mui/material/Button'
import { format } from 'date-fns'

import { Blog } from '../API'

type DrawerProps = {
  blogs?: Blog[]
  onDeleteBlog: (blog: Blog) => void
  onAddBlog: () => void
}

export const drawerWidth = 450

export default function Drawer({blogs, onDeleteBlog, onAddBlog}: DrawerProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleBlogClick = (blog: Blog) => {
    navigate(`/blogs/${blog.id}`)
  }

  return (
    <MuiDrawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          padding: 1,
        },
      }}
    >
      <Toolbar />
      <List>
        {blogs && blogs.map(blog => (
          <ListItem
            key={blog.id}
            secondaryAction={
              <IconButton edge="end" onClick={() => onDeleteBlog(blog)}>
                <DeleteIcon />
              </IconButton>
            }
            onClick={() => handleBlogClick(blog)}
            disablePadding
          >
            <ListItemButton selected={location.pathname.indexOf(`/blogs/${blog.id}`) >= 0}>
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary={blog.name} secondary={format(new Date(blog.createdAt), 'dd-MM-yyyy HH:mm')} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Button variant="outlined" onClick={onAddBlog}>Add new blog</Button>
    </MuiDrawer>
  )
}
