import React from 'react'
import Container from '@material-ui/core/Container'

import { TagsInput } from '@/components/TagsInput'

export function App() {
  return (
    <Container maxWidth="lg">
      <TagsInput />
    </Container>
  )
}
