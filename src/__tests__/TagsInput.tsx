import React from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'

import { TagsInput } from '@/components/TagsInput'

describe('TagsInput Component', () => {
  afterEach(jest.clearAllMocks)
  afterEach(cleanup)

  it('cria o snapshot do component', () => {
    const container = render(<TagsInput />)
    expect(container.asFragment()).toMatchSnapshot()
  })

  it('deve renderizar as tags enviadas por atributos', () => {
    const emails = ['contato@rarolabs.com.br', 'nao-responda@rarolabs.com.br']

    const { debug } = render(<TagsInput tags={emails} />)

    debug()
  })

  it('deve renderizar tags quando preencher o input e pressionar enter', () => {
    render(<TagsInput />)

    const input = screen.getByTestId('tags')

    fireEvent.change(input, { target: { value: 'contato@rarolabs.com.br' } })
    fireEvent.keyDown(input, {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      charCode: 13,
    })

    expect(screen.getByTestId('contato@rarolabs.com.br')).toBeTruthy()
  })

  it('deve renderizar tags quando preencher o input e pressionar tab', () => {
    render(<TagsInput />)

    const input = screen.getByTestId('tags')

    fireEvent.change(input, { target: { value: 'contato@rarolabs.com.br' } })
    fireEvent.keyDown(input, {
      key: 'Tab',
      code: 'Tab',
      keyCode: 9,
      charCode: 9,
    })

    expect(screen.getByTestId('contato@rarolabs.com.br')).toBeTruthy()
  })

  it('deve deletar a útima tag criada ao pressionar o botão de backspace', async () => {
    render(<TagsInput />)

    const input = screen.getByTestId('tags')

    fireEvent.change(input, { target: { value: 'contato@rarolabs.com.br' } })
    fireEvent.keyDown(input, {
      key: 'Tab',
      code: 'Tab',
      keyCode: 9,
      charCode: 9,
    })

    expect(screen.getByTestId('contato@rarolabs.com.br')).toBeTruthy()

    fireEvent.keyDown(input, {
      key: 'Backspace',
      code: 'Backspace',
      keyCode: 8,
      charCode: 8,
    })

    expect(screen.queryByTestId('contato@rarolabs.com.br')).toBeFalsy()
  })
})
