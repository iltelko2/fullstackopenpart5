import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container
  const blog = {
    user: '6676e04d736b2bf6dd3a9dfe',
    title: 'swadcwa',
    author: 'Ike',
    likes: 0,
    url: 'Component testing is done with react-testing-library'
  }
  const mockHandler = vi.fn()

  beforeEach(() => {
    container = render(<Blog blog={blog} likeBlogInner={mockHandler} />).container
  })

  test('renders content', () => {

    const element = screen.getByText('Component testing is done with react-testing-library')
    expect(element).toBeDefined()
  })

  test('renders title and author but not likes and url by default', () => {

    const element = screen.getByText(blog.title + ' ' + blog.author)
    expect(element).not.toHaveStyle('display: none')
    expect(element).toBeDefined()

    const span = container.querySelector('.blog_likes')
    expect(span.closest('p').closest('div')).toHaveStyle('display: none')

    const p = container.querySelector('.blog_url')
    expect(p.closest('div')).toHaveStyle('display: none')
  })

  test('renders title and author but also likes and url by when clicked', async () => {

    const element = screen.getByText(blog.title + ' ' + blog.author)
    expect(element).not.toHaveStyle('display: none')
    expect(element).toBeDefined()

    const user = userEvent.setup()
    const button = screen.getByText('show')
    await user.click(button)

    const span = container.querySelector('.blog_likes')
    expect(span.closest('p').closest('div')).not.toHaveStyle('display: none')

    const p = container.querySelector('.blog_url')
    expect(p.closest('div')).not.toHaveStyle('display: none')

    const p2 = container.querySelector('.blog_user')
    expect(p2.closest('div')).not.toHaveStyle('display: none')
  })

  test('if like is clicked, then likeBlogInner is called twice', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show')
    await user.click(button)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })

})