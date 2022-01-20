// eslint can't know something inside a query is a regex and complains about escaping.
/* eslint no-useless-escape: 0 */

const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')
const webpack = require(`webpack`)
const remark = require(`remark`)
const remarkHTML = require(`remark-html`)

async function getFolderEdges(folder, graphql, filter = '') {
  const { data, errors } = await graphql(`
    {
      allMarkdownRemark(
        limit: 1000
        filter: {
          fileAbsolutePath: {regex: "/(${folder})/.*\.md$/"}
          ${filter}
        }
      ) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              templateKey
              metadata {
                url
              }
              authors
            }
          }
        }
      }
    }
  `)

  if (errors) {
    // eslint-disable-next-line no-console
    errors.forEach((e) => console.error(e.toString()))
    return Promise.reject(errors)
  }

  return data.allMarkdownRemark.edges
}

async function getArrayFieldValues(graphql, name) {
  const { data, errors } = await graphql(`
    {
      allMarkdownRemark(
        filter: { frontmatter: { isPublished: { ne: false }, templateKey: { eq: "long-form-content" } } }
      ) {
        group(field: frontmatter___${name}s) {
          ${name}: fieldValue
          totalCount
        }
      }
    }
  `)

  if (errors) {
    // eslint-disable-next-line no-console
    errors.forEach((e) => console.error(e.toString()))
    return Promise.reject(errors)
  }

  return data.allMarkdownRemark.group
}

function withTrailingSlash(path) {
  return path.endsWith('/') ? path : `${path}/`
}

function getRelativeUrl(url) {
  const relativeUrl = url.match(/fingerprintjs.com(\/.*)$/)
  return relativeUrl ? withTrailingSlash(relativeUrl[1]) : '/'
}

function createPageFromEdge(edge, createPage, additionalContext = {}) {
  const id = edge.node.id
  const url = edge.node.frontmatter.metadata?.url

  createPage({
    path: url ? getRelativeUrl(url) : edge.node.fields.slug,
    tags: edge.node.frontmatter.tags,
    component: path.resolve(`src/templates/${String(edge.node.frontmatter.templateKey)}.tsx`),
    // additional data can be passed via context
    context: {
      id,
      ...additionalContext,
    },
  })
}

function createPaginatedPages(numPages, itemsPerPage, pathname, template, createPage, additionalContext = {}) {
  for (let i = 0; i < numPages; ++i) {
    createPage({
      // The first page doesn't need a number.
      path: `${pathname}${i === 0 ? '/' : `/${i + 1}/`}`,
      component: path.resolve(template),
      context: {
        limit: itemsPerPage,
        skip: i * itemsPerPage,
        numPages,
        currentPage: i + 1,
        ...additionalContext,
      },
    })
  }
}

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions

  const pages = await getFolderEdges('index', graphql)
  pages.forEach((edge) => createPageFromEdge(edge, createPage))

  const blogPosts = await getFolderEdges('blog', graphql, 'frontmatter: { isPublished: { ne: false } }')
  blogPosts.forEach((edge) => createPageFromEdge(edge, createPage))

  const caseStudies = await getFolderEdges('case-study', graphql)
  caseStudies.forEach((edge) => createPageFromEdge(edge, createPage))

  const solutions = await getFolderEdges('solutions/solutions', graphql, 'frontmatter: { isPublished: { ne: false } }')
  solutions.forEach((edge) => createPageFromEdge(edge, createPage))

  const featuredPosts = await getFolderEdges('blog', graphql, 'frontmatter: { featured: { eq: true } }')

  const postsPerPage = 12

  const numBlogPages = Math.ceil(blogPosts.length / postsPerPage)
  createPaginatedPages(numBlogPages, postsPerPage, 'blog', 'src/templates/blog.tsx', createPage)

  const numCaseStudyPages = Math.ceil(caseStudies.length / postsPerPage)
  createPaginatedPages(numCaseStudyPages, postsPerPage, 'case-studies', 'src/templates/case-studies.tsx', createPage)

  const numFeaturedPages = Math.ceil(featuredPosts.length / postsPerPage)
  createPaginatedPages(numFeaturedPages, postsPerPage, 'blog/featured', 'src/templates/blog-featured.tsx', createPage)

  const tags = await getArrayFieldValues(graphql, 'tag')
  tags.forEach(({ tag, totalCount }) => {
    const numTagPages = Math.ceil(totalCount / postsPerPage)
    const additionalContext = { tag }

    createPaginatedPages(
      numTagPages,
      postsPerPage,
      `blog/tag/${tag.toLowerCase()}`,
      'src/templates/blog-tag.tsx',
      createPage,
      additionalContext
    )
  })

  const authors = await getArrayFieldValues(graphql, 'author')
  authors.forEach(({ author, totalCount }) => {
    const numAuthorPages = Math.ceil(totalCount / postsPerPage)
    const additionalContext = { author }

    createPaginatedPages(
      numAuthorPages,
      postsPerPage,
      `blog/author/${author.toLowerCase()}`,
      'src/templates/author.tsx',
      createPage,
      additionalContext
    )
  })
}

function createNodePath({ node, getNode }) {
  const directory = getNode(node.parent).relativeDirectory
  const filename = path.basename(node.fileAbsolutePath, path.extname(node.fileAbsolutePath))

  switch (directory) {
    case 'index':
      // For nodes inside the index directory, the path is the filename.
      return filename
    default:
      // For other nodes, the path is directory/filename.
      return createFilePath({ node, getNode })
  }
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createNodePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

function getWebpackPlugin(config, name) {
  return config.plugins.find((plugin) => plugin.constructor.name === name)
}

function configureMiniCssExtractPlugin(config) {
  const miniCssExtractPlugin = getWebpackPlugin(config, 'MiniCssExtractPlugin')

  if (miniCssExtractPlugin) {
    miniCssExtractPlugin.options.ignoreOrder = true
  }
}

exports.onCreateWebpackConfig = ({ stage, actions, getConfig }) => {
  //To ignore the css order warnings in gatsby v3 in develop it is necessary to add stage === 'develop'
  if (stage === 'develop' || stage === 'build-javascript') {
    const config = getConfig()

    configureMiniCssExtractPlugin(config)

    actions.replaceWebpackConfig(config)
  }

  actions.setWebpackConfig({
    plugins: [
      new webpack.IgnorePlugin({
        resourceRegExp: /^netlify-identity-widget$/,
      }),
    ],
  })
}

exports.sourceNodes = async ({ actions, getNodes }) => {
  const { createNodeField } = actions

  const blogPosts = getNodes().filter(
    (node) => node.internal.type === 'MarkdownRemark' && /(blog)\/.*.md$/.test(node.fileAbsolutePath)
  )
  const authors = getNodes().filter(
    (node) => node.internal.type === 'MarkdownRemark' && /(author)\/.*.md$/.test(node.fileAbsolutePath)
  )

  blogPosts.forEach((node) => {
    if (node.frontmatter.authors) {
      const authorNodes = authors.filter((otherNode) => node.frontmatter.authors.includes(otherNode.frontmatter.title))

      if (authorNodes.length > 0) {
        createNodeField({
          node,
          name: 'authors',
          value: authorNodes,
        })
      }
    }
  })
}
exports.createSchemaCustomization = ({ actions }) => {
  // Define the @md tag to mark a field which should be interpreted as markdown and converted to HTML
  actions.createFieldExtension({
    name: 'md',
    extend() {
      return {
        resolve(source, args, context, info) {
          const fieldValue = context.defaultFieldResolver(source, args, context, info)
          return remark().use(remarkHTML).processSync(fieldValue).toString()
        },
      }
    },
  })
  actions.createTypes(`
    type MarkdownRemarkFrontmatter {
      header: Header
      summary: Summary
      cardSection: CardSection
      inlineCta: InlineCta
    }
    type Header{
      content: String @md
    }
    type Summary{
      results: [Results]
    }
    type Results implements Node{
      content: String @md
    }
    type CardSection{
      cards: [Cards]
      blocks: [Blocks]
    }
    type Cards implements Node{
      content: String @md
    }
    type Blocks implements Node{
      content: String @md
    }
    type InlineCta{
      subtitle: String @md
    }
    type NotificationBarYaml implements Node {
      barBody: String @md
    }
`)
}
