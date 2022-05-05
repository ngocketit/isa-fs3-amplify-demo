import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import { format } from 'date-fns'
import IconButton from '@mui/material/IconButton'
import ClearIcon from '@mui/icons-material/Clear'

import { Comment } from '../API'

type CommentItemProps = {
  comment: Comment
  onDelete: (comment: Comment) => void
}

export default function CommentItem({comment, onDelete}: CommentItemProps) {
  return (
    <Stack direction="column" spacing={0.5} sx={{position: 'relative', padding: 1, backgroundColor: '#eeeeee'}}>
      <Typography variant="body2">{comment.content}</Typography>
      <Typography variant="caption">{format(new Date(comment.createdAt), 'dd-MM-yyyy HH:mm')}</Typography>
      <IconButton onClick={() => onDelete(comment)} sx={{position: 'absolute', right: '10px', top: '5px'}}>
        <ClearIcon />
      </IconButton>
    </Stack>
  )
}
