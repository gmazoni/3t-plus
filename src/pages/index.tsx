import { DashboardLayout } from '@/components/structure/dashboard-layout'
import { trpc } from '@/utils/trpc'
import { Box, Card, Container, LinearProgress } from '@mui/material'
import Link from 'next/link'

function PostListingPage() {
  const { data, isLoading } = trpc.posts.all.useQuery({})

  if (isLoading) {
    return <LinearProgress />
  }

  return (
    <>
      <Box className="flex-grow py-8" component="main">
        <Container maxWidth={false}>
          <div className="mt-2 flex justify-evenly flex-wrap">
            {data?.map((post) => {
              return (
                <Card className="p-2 m-2 w-96 apply-test" key={post.id}>
                  <article>
                    <p>{post.title}</p>
                    <Link href={`/posts/${post.id}`}>Read post</Link>
                  </article>
                </Card>
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
