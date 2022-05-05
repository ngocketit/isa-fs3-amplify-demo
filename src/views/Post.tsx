import { useEffect, useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { API, graphqlOperation } from 'aws-amplify'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { format } from 'date-fns'

import { Post, Comment } from '../API'
import { getPost } from '../graphql/queries'
import { createComment, deleteComment } from '../graphql/mutations'
import { onCreateComment, onDeleteComment } from '../graphql/subscriptions'
import CommentForm from '../components/CommentForm'
import CommentItem from '../components/CommentItem'

export default function PostPage() {
  const { postId } = useParams()
  const [post, setPost] = useState<Post | undefined>(undefined)

  const fetchPost = useCallback(async () => {
    try {
      const resp = await API.graphql(graphqlOperation(getPost, {
        id: postId,
      })) as any
      setPost(resp.data.getPost)
    } catch (error) {
      console.error(error)
    }
  }, [postId, setPost])

  const handleCommentSubmit = async ({comment}: {comment: string}) => {
    try {
      await API.graphql(graphqlOperation(createComment, {
        input: {
          content: comment,
          postCommentsId: postId!,
        }
      }))
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteComment = async (comment: Comment) => {
    try {
      await API.graphql(graphqlOperation(deleteComment, {
        input: {
          id: comment.id,
        },
      }))
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchPost()
  }, [fetchPost])

  useEffect(() => {
    const subscription = (API.graphql(graphqlOperation(onCreateComment)) as any).subscribe({
      next: (resp: any) => {
        const newComment = resp.value.data.onCreateComment
        if (postId === newComment.postCommentsId) {
          if (post!.comments?.items) {
            post!.comments.items = [...post!.comments.items, newComment]
          } else {
            post!.comments!.items = [newComment]
          }
          setPost({...post!})
        }
      },
      error: console.error,
    })
    return () => subscription.unsubscribe()
  }, [post, postId])

  useEffect(() => {
    const subscription = (API.graphql(graphqlOperation(onDeleteComment)) as any).subscribe({
      next: (resp: any) => {
        const deletedComment = resp.value.data.onDeleteComment
        if (postId === deletedComment.postCommentsId) {
          if (post!.comments?.items) {
            const index = post!.comments?.items.findIndex(item => item?.id === deletedComment.id)
            if (index >= 0) {
              post!.comments?.items.splice(index, 1)
              setPost({...post!})
            }
          }
        }
      },
      error: console.error,
    })
    return () => subscription.unsubscribe()
  }, [post, postId])

  if (!post) return null

  return (
    <>
      <Stack direction="column" spacing={1} sx={{mb: 3}}>
        <Typography variant="h4">{post.title}</Typography>
        <Typography variant="caption">{format(new Date(post.createdAt), 'dd-MM-yyyy HH:mm')}</Typography>
        <Typography variant="body1">{post.content}</Typography>
      </Stack>
      <Stack direction="column" spacing={1} sx={{mb: 3}}>
        {post!.comments?.items.map(comment => (
          <CommentItem key={comment!.id} comment={comment!} onDelete={handleDeleteComment} />
        ))}
      </Stack>
      <CommentForm onSubmit={handleCommentSubmit} />
    </>
  )
}
