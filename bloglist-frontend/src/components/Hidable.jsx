import { useState } from 'react'
import PropTypes from 'prop-types'

const Hidable = (props) => {
  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div className={props.cls} style={blogStyle}>
      <span className="title">{props.title}</span>
      <button onClick={toggleVisibility}>{visible ? 'hide': 'show'}</button>
      <div style={showWhenVisible}>
        {props.children}
      </div>
    </div>
  )

}

Hidable.propTypes = {
  title: PropTypes.string.isRequired
}

Hidable.displayName = 'Togglable'

export default Hidable
