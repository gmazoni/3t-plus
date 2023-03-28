import { DashboardLayout } from '@/components/structure/dashboard-layout'
import { UserSearch, UserToolbar, UsersTable } from '@/components/users'
import { Box, Container } from '@mui/material'
import Head from 'next/head'

const UsersPage = () => {
  return (
    <>
      <Head>
        <title>Users</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <UserToolbar />
          <Box sx={{ mt: 3 }}>
            <UserSearch />
          </Box>
          <Box sx={{ mt: 3 }}>
            <UsersTable />
          </Box>
        </Container>
      </Box>
    </>
  )
}

UsersPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default UsersPage
