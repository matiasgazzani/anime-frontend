import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import type { ChangeEvent, Dispatch, SetStateAction } from 'react'

interface Props {
  count: number
  onChange: Dispatch<SetStateAction<number>>
}

export default function Pager ({ count, onChange }: Props) {
  const handleChange = (_: ChangeEvent<unknown>, value: number) => {
    onChange(value)
  }
  return (
    <Stack spacing={2} alignItems='center'>
      <Pagination
        count={count}
        variant='outlined'
        onChange={handleChange}
        sx={{
          '& .MuiPaginationItem-root': {
            color: '#9ca3af', // gray-400
            borderColor: 'rgba(107, 114, 128, 0.3)', // gray-500/30
            backgroundColor: 'rgba(31, 41, 55, 0.5)', // gray-800/50
            backdropFilter: 'blur(8px)',
            fontWeight: 600,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(168, 85, 247, 0.2)', // purple-500/20
              borderColor: 'rgba(168, 85, 247, 0.5)', // purple-500/50
              color: '#e9d5ff', // purple-200
              transform: 'scale(1.05)'
            }
          },
          '& .MuiPaginationItem-root.Mui-selected': {
            background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)', // purple-600 to pink-600
            borderColor: 'transparent',
            color: '#ffffff',
            fontWeight: 700,
            boxShadow: '0 4px 14px 0 rgba(147, 51, 234, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #a855f7 0%, #f472b6 100%)', // purple-500 to pink-500
              transform: 'scale(1.05)'
            }
          },
          '& .MuiPaginationItem-ellipsis': {
            color: '#6b7280' // gray-500
          }
        }}
      />
    </Stack>
  )
}
