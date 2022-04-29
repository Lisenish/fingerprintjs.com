import { graphql, useStaticQuery } from 'gatsby'

export function useMainBackgroundImage() {
  const data = useStaticQuery(
    graphql`
      {
        mainBackground: file(relativePath: { eq: "bg-full.png" }) {
          childImageSharp {
            gatsbyImageData(placeholder: BLURRED, formats: [AUTO], quality: 90, layout: FULL_WIDTH)
          }
        }
      }
    `
  )

  const mainBackground = data.mainBackground.childImageSharp.gatsbyImageData

  return { mainBackground }
}
