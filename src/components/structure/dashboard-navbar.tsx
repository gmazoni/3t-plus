import { Theme } from '@/theme'
import styled from '@emotion/styled'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import { AppBar, Box, IconButton, Menu, MenuItem, Toolbar, Tooltip } from '@mui/material'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useState } from 'react'

const DashboardNavbarRoot = styled(AppBar)(({ theme }: { theme: Theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
}))

const AccountMenu = () => {
  const { data: session } = useSession()

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  function handleClick(event) {
    setAnchorEl(event.currentTarget)
  }
  function handleClose() {
    setAnchorEl(null)
  }

  return (
    <div>
      <Tooltip title="Account">
        <IconButton
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleClick}
        >
          {session?.user?.image ? (
            <Image src={session?.user?.image} style={{ borderRadius: '50%' }} alt="avatar" width={35} height={35} />
          ) : (
            <AccountCircleIcon fontSize="large" />
          )}
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem>
          <Box display="flex" alignItems="center" onClick={() => signOut()}>
            <LogoutIcon />
            <Box ml={1}>Logout</Box>
          </Box>
        </MenuItem>
      </Menu>
    </div>
  )
}

export const DashboardNavbar = (props) => {
  const { onSidebarOpen, ...other } = props

  return (
    <>
      <DashboardNavbarRoot
        sx={{
          left: {
            lg: 280,
          },
          width: {
            lg: 'calc(100% - 280px)',
          },
        }}
        {...other}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2,
          }}
        >
          <IconButton
            onClick={onSidebarOpen}
            sx={{
              display: {
                xs: 'inline-flex',
                lg: 'none',
              },
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />
          <AccountMenu />
        </Toolbar>
      </DashboardNavbarRoot>
    </>
  )
}
