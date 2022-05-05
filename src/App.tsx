import { useEffect, useState } from 'react'
import '@aws-amplify/ui-react/styles.css'
import { Authenticator } from '@aws-amplify/ui-react'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Toolbar from '@mui/material/Toolbar'
import { Routes, Route } from 'react-router-dom'
import { API, graphqlOperation, Hub } from 'aws-amplify'

import Appbar from './components/Appbar'
import Drawer, { drawerWidth } from './components/Drawer'
import HomePage from './views/Home'
import BlogPage from './views/Blog'
import { listBlogs } from './graphql/queries'
import { deleteBlog, createBlog } from './graphql/mutations'
import {onCreateBlog } from './graphql/subscriptions'
import { Blog } from './API'
import BlogForm from './components/BlogForm'
import PostPage from './views/Post'

function App() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [addBlogOpen, setAddBlogOpen] = useState(false)

  const fetchBlogs = async () => {
    try {
      const resp = (await API.graphql(graphqlOperation(listBlogs))) as any
      setBlogs(resp.data.listBlogs?.items)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteBlog = async (blog: Blog) => {
    try {
      await API.graphql(graphqlOperation(deleteBlog, {
        input: {
          id: blog.id,
        }
      }))
      const index = blogs.findIndex(item => item.id === blog.id)
      if (index >= 0) {
        blogs.splice(index, 1)
        setBlogs([...blogs])
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleAddBlog = () => {
    setAddBlogOpen(true)
  }

  const handleAddBlogClose = () => {
    setAddBlogOpen(false)
  }

  const handleAddBlogSubmit = async ({name}: {name: string}) => {
    setAddBlogOpen(false)
    try {
      await API.graphql(graphqlOperation(createBlog, {
        input: {
          name,
        }
      }))
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    Hub.listen('auth', (data: any) => {
      if (data.payload.event === 'signIn') {
        fetchBlogs()
      }
    })
    fetchBlogs()
    return () => Hub.remove('auth', () => {
      console.log('Stop listening for auth events')
    })
  }, [])

  useEffect(() => {
    const subscription = (API.graphql(graphqlOperation(onCreateBlog)) as any).subscribe({
      next: (resp: any) => {
        setBlogs([...blogs, resp.value.data.onCreateBlog])
      },
      error: (err: any) => console.warn(err),
    })
    return () => subscription.unsubscribe()
  }, [setBlogs, blogs])

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Authenticator>
        {({ signOut, user }) => (
          <>
            <CssBaseline />
            <Appbar signOut={signOut!} user={user} />
            <Box
              component="nav"
              sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
              aria-label="mailbox folders"
            >
              <Drawer blogs={blogs} onDeleteBlog={handleDeleteBlog} onAddBlog={handleAddBlog} />
            </Box>
            <Box
              component="main"
              sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
              <Toolbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/blogs/:blogId" element={<BlogPage />} />
                <Route path="/blogs/:blogId/posts/:postId" element={<PostPage />} />
              </Routes>
            </Box>
            <BlogForm open={addBlogOpen} onClose={handleAddBlogClose} onSubmit={handleAddBlogSubmit} />
          </>
        )}
      </Authenticator>
    </Box>
  )
}

export default App
