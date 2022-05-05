import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { API, graphqlOperation } from 'aws-amplify'
import List from '@mui/material/List'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import {useNavigate} from 'react-router'
import Button from '@mui/material/Button'

import { Blog, Post } from '../API'
import { getBlog } from '../graphql/queries'
import { createPost } from '../graphql/mutations'
import { onCreatePost } from '../graphql/subscriptions'
import PostItem from '../components/PostItem'
import PostForm from '../components/PostForm'

export default function BlogPage() {
  const { blogId } = useParams()
  const [blog, setBlog] = useState<Blog | undefined>(undefined)
  const navigate = useNavigate()
  const [newPostOpen, setNewPostOpen] = useState(false)

  const fetchBlog = useCallback(async () => {
    try {
      const resp = await API.graphql(graphqlOperation(getBlog, {
        id: blogId,
      })) as any
      setBlog(resp.data.getBlog)
    } catch (error) {
      console.error(error)
    }
  }, [blogId])

  const handleClickPost = (post: Post) => {
    navigate(`/blogs/${blogId}/posts/${post.id}`)
  }

  const handleNewPostClick = () => {
    setNewPostOpen(true)
  }

  const handlePostFormClose = () => {
    setNewPostOpen(false)
  }

  const handlePostFormSubmit = async ({title, content}: {title: string, content: string}) => {
    try {
      await API.graphql(graphqlOperation(createPost, {
        input: {
          title,
          content,
          blogPostsId: blogId!,
        }
      }))
      setNewPostOpen(false)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchBlog()
  }, [blogId, fetchBlog])

  useEffect(() => {
    const subscription = (API.graphql(graphqlOperation(onCreatePost)) as any).subscribe({
      next: (resp: any) => {
        const post = resp.value.data.onCreatePost
        if (blogId === post.blogPostsId) {
          if (blog!.posts?.items) {
            blog!.posts.items = [...blog!.posts.items, post]
          } else {
            blog!.posts!.items = [post]
          }
          setBlog({...blog!})
        }
      },
      error: (err: any) => console.warn(err),
    })
    return () => subscription.unsubscribe()
  }, [blog, blogId])

  if (!blog) return null

  return (
    <>
      <Stack direction="column">
        <Stack direction="row">
          <Typography variant="h4" sx={{flex: 1}}>{blog.name}</Typography>
          <Button variant="outlined" onClick={handleNewPostClick}>Add new post</Button>
        </Stack>
        <List>
          {blog.posts && blog.posts.items?.map(post => (
            <PostItem
              key={post!.id}
              post={post!}
              onPostClick={handleClickPost}
            />
          ))}
        </List>
        <PostForm
          open={newPostOpen}
          onClose={handlePostFormClose}
          onSubmit={handlePostFormSubmit}
        />
      </Stack>
    </>
  )
}
