import { Box, Button, ListItem } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'

export const NavItem = (props) => {
  const { href, icon, title, ...others } = props
  const router = useRouter()
  const active = href ? router.pathname === href : false

  return (
    <ListItem
      disableGutters
      sx={{
        display: 'flex',
        mb: 0.5,
        py: 0,
        px: 2,
      }}
      {...others}
    >
      <Button
        component={Link}
        href={href}
        startIcon={icon}
        disableRipple
        sx={{
          borderRadius: 1,
          color: active ? 'secondary.main' : 'neutral.300',
          fontWeight: active ? 'fontWeightBold' : 'fontWeightRegular',
          justifyContent: 'flex-start',
          px: 3,
          textAlign: 'left',
          textTransform: 'none',
          width: '100%',
          backgroundColor: active ? 'rgba(255,255,255, 0.08)' : 'transparent',
          '& .MuiButton-startIcon': {
            color: active ? 'secondary.main' : 'neutral.400',
          },
          '&:hover': {
            backgroundColor: 'rgba(255,255,255, 0.08)',
          },
        }}
      >
        <Box sx={{ flexGrow: 1 }}>{title}</Box>
      </Button>
    </ListItem>
  )
}
