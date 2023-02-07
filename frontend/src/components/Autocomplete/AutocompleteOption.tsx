import { Box, Chip, Typography } from "@mui/material"

type AutocompleteOptionProps<T> = {option: T} & React.HTMLAttributes<HTMLLIElement>

export const AutocompleteOption = <T extends {
  mark?: string | number, data?: string
},>({
  option,
  ...props
}: AutocompleteOptionProps<T>) => {
  return (
    <Box {...props} component='li'>
      <Typography variant='body1'>
        <Chip
          component={'span'}
          label={option.mark} 
          size='small' 
          color='secondary' 
          sx={{
            marginRight: 0.5, 
            "&:hover": {cursor: 'pointer'}
          }}
        />
        {option.data}
      </Typography>
    </Box>
  )
}