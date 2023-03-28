import { NavItem } from './nav-item'
import { Theme } from '@/theme'
import { trpc } from '@/utils/trpc'
import DnsIcon from '@mui/icons-material/Dns'
import ListAltIcon from '@mui/icons-material/ListAlt'
import PeopleIcon from '@mui/icons-material/People'
import { Box, Divider, Drawer, Typography, useMediaQuery } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const items = [
  {
    href: '/',
    icon: <ListAltIcon fontSize="small" />,
    title: 'Posts',
  },
  {},
  {
    href: '/users',
    icon: <PeopleIcon fontSize="small" />,
    title: 'Users',
  },
  {
    href: '/swagger',
    icon: <DnsIcon fontSize="small" />,
    title: 'Swagger',
  },
]

export const DashboardSidebar = (props) => {
  const { open, onClose } = props
  const router = useRouter()
  const lgUp = useMediaQuery<Theme>((theme) => theme.breakpoints.up('lg'), {
    defaultMatches: true,
    noSsr: false,
  })

  const { data } = trpc.user.me.useQuery()

  useEffect(
    () => {
      if (!router.isReady) {
        return
      }

      if (open) {
        onClose?.()
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.asPath]
  )

  const content = (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <Box m={2}>
          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              px: 3,
              py: '11px',
              borderRadius: 1,
            }}
          >
            <div>
              <Typography color="inherit" variant="subtitle1">
                {'3T App'}
              </Typography>
              <Typography color="neutral.400" variant="body2">
                {`${data?.user?.name ?? data?.user?.email ?? '-'}`}
              </Typography>
            </div>
          </Box>
        </Box>

        <Divider
          sx={{
            borderColor: '#2D3748',
            my: 3,
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          {items.map((item) => {
            if (item.href) {
              return <NavItem key={item.title} icon={item.icon} href={item.href} title={item.title} />
            } else {
              return (
                <Divider
                  key={null}
                  sx={{
                    borderColor: '#2D3748',
                    my: 3,
                  }}
                />
              )
            }
          })}
        </Box>
        <Divider sx={{ borderColor: '#2D3748' }} />
        <Box
          sx={{
            px: 2,
            py: 3,
          }}
        >
          <Typography color="neutral.100" variant="subtitle2">
            Company
          </Typography>
          <Typography color="neutral.500" variant="body2">
            {`Copyright ${new Date().getFullYear()}`}
          </Typography>
          <Box
            sx={{
              mt: 2,
              mx: 'auto',
              width: '100px',
            }}
          >
            <Image alt="" src="/logo.png" width={100} height={72} priority={true} />
          </Box>
        </Box>
      </Box>
    </>
  )

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            color: '#FFFFFF',
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    )
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  )
}
