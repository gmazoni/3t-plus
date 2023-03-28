import { DashboardLayout } from '@/components/structure/dashboard-layout'
import { trpc } from '@/utils/trpc'
import { Box, Container, LinearProgress } from '@mui/material'
import Error from 'next/error'
import { useRouter } from 'next/router'

function SinglePostPage() {
  const router = useRouter()

  const postId = router.query.postId as string

  const { data, isLoading } = trpc.posts['single-post'].useQuery({ postId })

  if (isLoading) {
    return <LinearProgress />
  }

  if (!data) {
    return <Error statusCode={404} />
  }

  return (
    <Container maxWidth={false}>
      <Box>
        <h1>{data.title}</h1>
        <p>{data.body}</p>
      </Box>
    </Container>
  )
}

SinglePostPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default SinglePostPage
