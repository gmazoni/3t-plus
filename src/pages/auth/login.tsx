import { CreateUserInput } from '@/schemas/user.schema'
import { trpc } from '@/utils/trpc'
import { Alert, Box, Button, Container, TextField, Typography } from '@mui/material'
import Head from 'next/head'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

function LoginForm() {
  const { handleSubmit, register } = useForm<CreateUserInput>()
  const [success, setSuccess] = useState(false)

  const { mutate, error } = trpc.user['request-otp'].useMutation({
    onSuccess: () => {
      setSuccess(true)
    },
  })

  function onSubmit(values: CreateUserInput) {
    mutate(values)
  }

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Box
        component="main"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          minHeight: '100%',
        }}
      >
        <Container maxWidth="sm">
          {error && <Alert severity="error">{error.message}</Alert>}
          {success && <Alert severity="success">Check your email</Alert>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ my: 3 }}>
              <Typography color="textPrimary" variant="h4">
                Login
              </Typography>
              <Typography color="textSecondary" gutterBottom variant="body2">
                {'Login Site'}
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Email Address"
              margin="normal"
              type="email"
              variant="outlined"
              {...register('email')}
              placeholder="user@kascosys.com.br"
              disabled={success}
            />

            <Box sx={{ py: 2 }}>
              <Button color="primary" fullWidth size="large" type="submit" variant="contained" disabled={success}>
                Login
              </Button>
            </Box>
          </form>
        </Container>
      </Box>
    </>
  )
}

export default LoginForm
