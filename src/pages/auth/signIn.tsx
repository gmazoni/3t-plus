import { trpc } from '@/utils/trpc'
import { LinearProgress } from '@mui/material'
import { useRouter } from 'next/router'

function VerifyToken() {
  const router = useRouter()

  trpc.user['verify-otp'].useQuery(
    {
      hash: router.query.token as string,
    },
    {
      onSuccess: () => {
        router.push('/')
      },
    }
  )

  return <LinearProgress />
}

export default VerifyToken
