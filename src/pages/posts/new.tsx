import { DashboardLayout } from '@/components/structure/dashboard-layout'
import { CreatePostInput } from '@/schemas/post.schema'
import { trpc } from '@/utils/trpc'
import { Box, Button, Container, Stack, TextField, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'

function CreatePostPage() {
  const { handleSubmit, register } = useForm<CreatePostInput>()
  const router = useRouter()

  const { mutate, error } = trpc.posts['create-post'].useMutation({
    onSuccess: ({ id }) => {
      router.push(`/posts/${id}`)
    },
  })

  function onSubmit(values: CreatePostInput) {
    mutate(values)
  }

  return (
    <>
      <Box className="flex-grow py-8" component="main">
        <Container maxWidth={false}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {error && error.message}

            <Typography sx={{ m: 1 }} variant="h4">
              Create posts
            </Typography>

            <Stack spacing={2} direction="column">
              <TextField fullWidth label="Title" placeholder="Your post title" {...register('title')} />

              <TextField fullWidth label="Body" placeholder="Your post content" {...register('body')} />
            </Stack>
            <Box sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" color="success" size="large">
                Salvar
              </Button>
            </Box>
          </form>
        </Container>
      </Box>
    </>
  )
}

CreatePostPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default CreatePostPage
