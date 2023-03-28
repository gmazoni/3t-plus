import { userComponentsContext } from '@/components/users'
import { paginationSchema } from '@/schemas/user.schema'
import { trpc } from '@/utils/trpc'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import {
  Alert,
  AlertColor,
  Box,
  Button,
  Card,
  Divider,
  Grow,
  LinearProgress,
  Modal,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'

function UsersTable() {
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertdata, setAlertData] = useState<{
    type: AlertColor
    message: string
  }>({ type: 'success', message: '' })
  const [modalOpen, setModalOpen] = useState(false)
  const [modaldata, setModalData] = useState<{ email: string; name: string }>({
    email: '',
    name: '',
  })

  const router = useRouter()

  const {
    data: tableData,
    isLoading: tableLoading,
    refetch: refetchTableData,
  } = trpc.user.list.useQuery(paginationSchema.parse(router.query))

  useContext(userComponentsContext).refetchTableData = refetchTableData

  const { mutate: mutateDeleteUser } = trpc.user['delete-user'].useMutation()

  if (tableLoading) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    )
  }

  const page = Number(router.query.page) || 1
  const perPage = Number(router.query.perPage) || 10
  const search = String(router.query.search || '')

  const handlePageChange = (_e: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    pushToRouter({ page: page + 1, perPage, search })
  }

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    pushToRouter({ page: 1, perPage: Number(e.target.value), search })
  }

  const pushToRouter = ({ page, perPage, search }: { page: number; perPage: number; search: string }) => {
    const urlParams = `/users?page=${page}&perPage=${perPage}&search=${search}`
    router.push(urlParams, urlParams, { shallow: false })
  }

  const deleteUser = (email: string) => {
    mutateDeleteUser(
      { email },
      {
        onSuccess: () => {
          showAlert({ type: 'success', message: 'User deleted successfully' })
          refetchTableData()
        },
        onError: (error) => {
          showAlert({ type: 'error', message: error.message })
        },
      }
    )

    hideModal()
  }

  const showAlert = ({ type, message }: { type: AlertColor; message: string }) => {
    setAlertData({ type, message })
    setAlertOpen(true)
  }

  const handleAlertClose = () => {
    setAlertOpen(false)
  }

  const showModal = ({ email, name }) => {
    setModalData({ email, name })
    setModalOpen(true)
  }

  const hideModal = () => {
    setModalOpen(false)
    setModalData({ email: '', name: '' })
  }

  return (
    <>
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
                Delete user?
              </Typography>
              <Divider
                sx={{
                  marginTop: '20px',
                  marginBottom: '20px',
                }}
              />
              Are you sure you want to delete {modaldata.name}?
              <Divider
                sx={{
                  marginTop: '20px',
                  marginBottom: '20px',
                }}
              />
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  deleteUser(modaldata.email)
                }}
              >
                Yes
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
            </Card>
          </Box>
        </Grow>
      </Modal>
      <Card>
        <Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData?.users.map((user) => {
                const { email, name } = user

                return (
                  <TableRow key={email}>
                    <TableCell>{name}</TableCell>
                    <TableCell>{email}</TableCell>
                    <TableCell
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <Button variant="contained" color="error" onClick={() => showModal({ email, name })}>
                        <DeleteForeverIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Box>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={tableData?.total || 0}
          rowsPerPage={perPage}
          page={page - 1}
          color="primary"
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Card>
    </>
  )
}

export default UsersTable
