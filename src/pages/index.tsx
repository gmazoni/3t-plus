import { DashboardLayout } from '@/components/structure/dashboard-layout'
import { trpc } from '@/utils/trpc'
import { Box, Button, Container, LinearProgress } from '@mui/material'
import Link from 'next/link'

function PostListingPage() {
  const { data, isLoading } = trpc.posts.all.useQuery({})

  if (isLoading) {
    return <LinearProgress />
  }

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <div>
            <Link href="/posts/new">
              <Button variant="contained">Create new post</Button>
            </Link>
          </div>

          <div style={{ marginTop: 20 }}>
            {data?.map((post) => {
              return (
                <article key={post.id}>
                  <p>{post.title}</p>
                  <Link href={`/posts/${post.id}`}>Read post</Link>
                </article>
              )
            })}
          </div>
        </Container>
      </Box>
    </>
  )
}

PostListingPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default PostListingPage
