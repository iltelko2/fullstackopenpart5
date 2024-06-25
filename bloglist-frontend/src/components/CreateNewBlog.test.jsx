import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateNewBlog from './CreateNewBlog'
import { expect } from 'vitest'


test('create blog with right info', async () => {
  const mockHandler = vi.fn()
  const mockHandler2 = vi.fn()
  const mockHandler3 = vi.fn()
  const container = render(<CreateNewBlog CreateBlog={mockHandler} setError={mockHandler2} setErrorMessage={mockHandler3}></CreateNewBlog>).container

  const title = container.querySelector('#input_title')
  const url = container.querySelector('#input_url')
  const author = container.querySelector('#input_author')

  const user = userEvent.setup()
  await user.type(title, 'miljoona ruusua')
  await user.type(author, 'Pelle Miljoona')
  await user.type(url, 'www.fi')

  const createButton = screen.getByText('Create')
  await user.click(createButton)

  expect(mockHandler.mock.calls).toHaveLength(1)
  console.log(mockHandler.mock.calls[0][0])
  expect(mockHandler.mock.calls[0][0].title).toBe('miljoona ruusua')
  expect(mockHandler.mock.calls[0][0].author).toBe('Pelle Miljoona')
  expect(mockHandler.mock.calls[0][0].url).toBe('www.fi')

})