import { jest } from '@jest/globals'

const React = require('react')
const gatsby = jest.requireActual('gatsby')
module.exports = {
  ...gatsby,
  graphql: jest.fn(),
  Link: jest.fn().mockImplementation(
    // these props are invalid for an `a` tag
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ activeClassName, activeStyle, getProps, innerRef, partiallyActive, ref, replace, to, ...rest }) =>
      React.createElement('a', {
        ...rest,
        href: to,
      })
  ),
  StaticQuery: jest.fn(),
  useStaticQuery: jest.fn(),
}
