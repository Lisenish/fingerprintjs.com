export function withTrailingSlash(url: string) {
  return url.endsWith('/') ? url : `${url}/`
}

export function getRelativeUrl(url: string) {
  const relativeUrl = url.match(/fingerprintjs.com(\/.*)$/)
  return relativeUrl ? withTrailingSlash(relativeUrl[1]) : '/'
}

export const isLocalLink = (link: string) => /^\/(?!\/)/.test(link)

export const getHostname = (url: string) => {
  // use URL constructor and return hostname
  return new URL(url).hostname
}
