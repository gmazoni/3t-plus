import { userComponentsContext } from '@/components/users'
import { CreateUserInput } from '@/schemas/user.schema'
import { trpc } from '@/utils/trpc'
import AddIcon from '@mui/icons-material/Add'
import {
  Alert,
  AlertColor,
  Box,
  Button,
  Card,
  Divider,
  Grow,
  Modal,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material'
import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'

type InputError = Record<
  string,
  {
    helperText: string
    error: boolean
  }
>

function UserToolbar() {
  const { refetchTableData } = useContext(userComponentsContext)

  const [modalOpen, setModalOpen] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertdata, setAlertData] = useState<{ type: AlertColor; message: string }>({ type: 'success', message: '' })
  const [errors, setErrors] = useState<InputError>({})

  const { handleSubmit, register, reset } = useForm<CreateUserInput>()

  const { mutate } = trpc.user['register-user'].useMutation({
    onSuccess: () => {
      showAlert({ type: 'success', message: 'User added successfully' })
      hideModal()

      refetchTableData()
    },
    onError: (error) => {
      try {
        const errorData = JSON.parse(error.message).reduce(
          (acc: InputError, err: { path: [string]; message: string }) => {
            const [field] = err.path

            acc[field] = {
              helperText: err.message,
              error: true,
            }

            return acc
          },
          {}
        )

        setErrors(errorData)
      } catch (e) {
        setErrors({})
        showAlert({
          type: 'error',
          message: error.message || 'Error adding user',
        })
      }
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target
    setErrors({ ...errors, [name]: { helperText: '', error: false } })
  }

  const showAlert = ({ type, message }: { type: AlertColor; message: string }) => {
    setAlertData({ type, message })
    setAlertOpen(true)
  }

  const handleAlertClose = () => {
    setAlertOpen(false)
  }

  const onSubmit = (values: CreateUserInput) => {
    mutate(values)
  }

  const showModal = () => {
    reset()
    setErrors({})
    setModalOpen(true)
  }

  const hideModal = () => {
    setModalOpen(false)
  }

  return (
    <>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          m: -1,
        }}
      >
        <Typography sx={{ m: 1 }} variant="h4">
          Users
        </Typography>
        <Box sx={{ m: 1 }}>
          <Button color="primary" variant="contained" onClick={showModal}>
            Add user
            <AddIcon />
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={alertdata.type} sx={{ width: '100%' }} onClose={handleAlertClose}>
          {alertdata.message}
        </Alert>
      </Snackbar>

      <Modal open={modalOpen}>
        <Grow in={modalOpen} timeout={300}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <Card
              sx={{
                width: '100%',
                maxWidth: '500px',
                marginTop: '20px',
                marginBottom: '20px',
                padding: '20px',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  marginBottom: '20px',
                }}
              >
                Add user
              </Typography>
              <Divider
                sx={{
                  marginTop: '20px',
                  marginBottom: '20px',
                }}
              />
              <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  typeof="email"
                  label="Email"
                  variant="outlined"
                  placeholder="someuser@gmail.com"
                  {...register('email')}
                  {...errors?.email}
                  onChange={handleChange}
                />

                <TextField
                  typeof="text"
                  label="Name"
                  variant="outlined"
                  placeholder="John Doe"
                  sx={{ marginTop: '10px' }}
                  {...register('name')}
                  {...errors?.name}
                  onChange={handleChange}
                />

                <Divider
                  sx={{
                    marginTop: '20px',
                    marginBottom: '20px',
                  }}
                />
                <Button type="submit" variant="contained" color="primary">
                  Add user
                </Button>
                <Button
                  onClick={hideModal}
                  variant="contained"
                  color="secondary"
                  sx={{
                    float: 'right',
                  }}
                >
                  Cancel
                </Button>
              </form>
            </Card>
          </Box>
        </Grow>
      </Modal>
    </>
  )
}

export default UserToolbar
