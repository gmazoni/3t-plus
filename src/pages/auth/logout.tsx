import { trpc } from '@/utils/trpc'
import { LinearProgress } from '@mui/material'
import { useRouter } from 'next/router'

function LogOut() {
  const router = useRouter()

  const { isLoading } = trpc.user.logout.useQuery(undefined, {
    onSuccess: () => {
      router.push('/')
    },
  })

  if (isLoading) {
    return <LinearProgress />
  }

  return <LinearProgress />
}

export default LogOut
