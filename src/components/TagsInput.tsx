import React from 'react'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip'
import Grid from '@material-ui/core/Grid'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'

import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react'

import { getById, update } from '@/http/mailingListsRequests'
import { MailingList } from '@/models/mailingLists'
import { multipleTags } from '@/utils/multipleTags'
import { tagAlreadyExists } from '@/utils/tagAlreadyExists'
import { verifyingValidEmail } from '@/utils/verifyingValidEmail'

interface TagsInputProps {
  tags?: string[]
}

export function TagsInput({ tags }: TagsInputProps) {
  const [inputTags, setInputTags] = useState('')
  const [emailsTags, setEmailsTags] = useState([] as string[])
  const [mailingList, setMailingList] = useState({} as MailingList)

  const css = makeStyles((theme: Theme) =>
    createStyles({
      tagsWrapper: {
        marginTop: theme.spacing(3),
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        '& > *': {
          margin: theme.spacing(0.5),
        },
      },
    })
  )()

  useEffect(() => {
    async function getData() {
      const { data } = await getById('3ba1d46f-cdef-aafb-f67e-a0f3bd4b1473')

      setMailingList({ ...data, emails: [...tags, ...data.emails] })
      setEmailsTags([...tags, ...data.emails])
    }

    getData()
  }, [tags])

  // verificar se a tag é um email válido e se ela já existe
  function itIsPossibleToAddTheTag(tag: string) {
    return verifyingValidEmail(tag) && !tagAlreadyExists(emailsTags, tag)
  }

  // verificar se a tag já está sendo considerada quando múltipas tags são inseridas
  function theTagHasAlreadyBeenConsidered(consideredTags: string[], newTag: string) {
    return tagAlreadyExists(consideredTags, newTag)
  }

  // adicionar tags
  function onAddNewTags() {
    if (multipleTags(inputTags)) {
      const typedTags = inputTags.split(';')
      const tagsPrepared: string[] = []

      typedTags.forEach(tag => {
        if (itIsPossibleToAddTheTag(tag) && !theTagHasAlreadyBeenConsidered(tagsPrepared, tag)) {
          tagsPrepared.push(tag)
        }
      })

      setEmailsTags([...emailsTags, ...tagsPrepared])
      setInputTags('')
    } else {
      const newTag = inputTags

      if (verifyingValidEmail(newTag) && !tagAlreadyExists(emailsTags, newTag)) {
        setEmailsTags([...emailsTags, newTag])
        setInputTags('')
      } else {
        setInputTags('')
      }
    }
  }

  // deletar a última tag
  function onDeleteTheLastTag() {
    const deletedTag = emailsTags.pop()

    setEmailsTags(emailsTags.filter(tag => tag !== deletedTag))
  }

  // deletar uma tag
  function handleDeleteTag(tagToDelete: string) {
    setEmailsTags(emailsTags.filter(tag => tag !== tagToDelete))
  }

  // pegar as tags digitadas
  function handleChangeInputTags(event: ChangeEvent<HTMLInputElement>) {
    setInputTags(event.target.value)
  }

  // decidir ação com base na tecla precionada pelo usuário
  function handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Tab':
        onAddNewTags()
        break

      case 'Enter':
        onAddNewTags()
        break

      case 'Backspace':
        onDeleteTheLastTag()
        break

      default:
        break
    }
  }

  // atualizar a mailing list
  async function handleSubmit() {
    const { success, data } = await update({ ...mailingList, emails: emailsTags })

    if (success) {
      setMailingList(data)
      setEmailsTags([...tags, ...data.emails])
    }
  }

  return (
    <>
      <Grid container justify="flex-end" style={{ marginBottom: 20 }}>
        <Grid item>
          <Button size="small" variant="contained" color="primary" onClick={handleSubmit}>
            SUBMIT
          </Button>
        </Grid>
      </Grid>

      <Grid container justify="center">
        <Grid item>
          <TextField
            fullWidth
            id="tags"
            name="tags"
            margin="dense"
            placeholder="add tags"
            value={inputTags}
            label="tags"
            variant="outlined"
            onKeyDown={handleKeyDown}
            onChange={handleChangeInputTags}
            inputProps={{ 'data-testid': 'tags' }}
            InputProps={{
              startAdornment: <InputAdornment position="start">To:</InputAdornment>,
            }}
          />

          <Box className={css.tagsWrapper}>
            {emailsTags.map(tag => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                tabIndex={-1}
                data-testid={tag}
                onDelete={() => handleDeleteTag(tag)}
              />
            ))}
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

TagsInput.defaultProps = {
  tags: [],
}
