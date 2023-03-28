import { PaginationInput } from '@/schemas/user.schema'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Card, CardContent, InputAdornment, TextField } from '@mui/material'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'

function UserSearch() {
  const router = useRouter()

  const { handleSubmit, register } = useForm<PaginationInput>({
    defaultValues: {
      page: Number(router.query.page) || 1,
      perPage: Number(router.query.perPage) || 10,
      search: String(router.query.search || ''),
    },
  })

  let debounceSearch: ReturnType<typeof setTimeout>
  const onSubmit = (values: PaginationInput) => {
    clearTimeout(debounceSearch)
    debounceSearch = setTimeout(() => {
      const urlParams = `/users?page=${values.page}&perPage=${values.perPage}&search=${values.search}`
      router.push(urlParams, urlParams, { shallow: true })
    }, 500)
  }

  return (
    <>
      <Card>
        <CardContent>
          <Box sx={{ minWidth: '100%' }}>
            <TextField
              {...register('search')}
              label="Search"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              onKeyUp={handleSubmit(onSubmit)}
            />
          </Box>
        </CardContent>
      </Card>
    </>
  )
}

export default UserSearch
