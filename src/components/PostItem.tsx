import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'
import { format } from 'date-fns'

import { Post } from '../API'

type PostItemProps = {
  post: Post
  onPostClick: (post: Post) => void
}

export default function PostItem({post, onPostClick}: PostItemProps) {
  return (
    <ListItem
      key={post.id}
      onClick={() => onPostClick(post)}
      disablePadding
    >
      <ListItemButton>
        <ListItemText primary={post.title} secondary={format(new Date(post.createdAt), 'dd-MM-yyyy HH:mm')} />
      </ListItemButton>
    </ListItem>
  )
}
