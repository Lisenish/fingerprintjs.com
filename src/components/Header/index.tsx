import React, { useState, useEffect } from 'react'
import Navbar from '../Navbar'
import { Link } from 'gatsby'
import Prism from 'prismjs'
import GithubButton from '../GithubButton'
import { ReactComponent as BurgerSvg } from './burger.svg'
import MobileNavbar from '../MobileNavbar'
import Button from '../common/Button'
import Container from '../common/Container'
import { isBrowser } from '../../helpers/detector'
import HeaderBar from '../../components/HeaderBar/HeaderBar'
import { useCaseLinks } from '../../constants/content'
import classNames from 'classnames'
import { URL, PATH } from '../../constants/content'
import DropdownList from './DropdownList'
import { useUtmParams } from '../../hooks/useUtmParams'
import { buildQueryString } from '../../helpers/common'
import { ReactComponent as LogoSvg } from './fpjs.svg'

import styles from './Header.module.scss'

interface HeaderProps {
  headerBarTitle?: string
  headerBarLinkText?: string
  headerBarLinkUrl?: string
}
export default function Header({ headerBarTitle, headerBarLinkText, headerBarLinkUrl }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const utmInfo = useUtmParams()

  useEffect(() => {
    const mobileBodyClass = 'isMobileMenuOpen'
    if (isBrowser && isMobileMenuOpen) {
      document.body.classList.add(mobileBodyClass)
    } else {
      document.body.classList.remove(mobileBodyClass)
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    Prism.highlightAll()
  }, [])

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className={styles.header}>
      {headerBarTitle && (
        <HeaderBar linkText={headerBarLinkText} linkUrl={headerBarLinkUrl}>
          {headerBarTitle}
        </HeaderBar>
      )}
      <Navbar />
      <div className={styles.nav}>
        <Container size='large'>
          <nav className={styles.navMain}>
            <div className={styles.navLeft}>
              <Link to='/' className={`${styles.link} ${styles.linkLogo}`} title='Logo'>
                <LogoSvg className={styles.logo} />
              </Link>
              <Link className={classNames(styles.link, styles.desktopOnly)} to='/why-fpjs/'>
                Why Us
              </Link>
              <DropdownList name='Use Cases' list={useCaseLinks} />
              <Link className={classNames(styles.link, styles.desktopOnly)} to='/demo/'>
                Demo
              </Link>
              <Link className={classNames(styles.link, styles.desktopOnly)} to='/pricing/'>
                Pricing
              </Link>
            </div>
            <div className={styles.navRight}>
              <GithubButton className={styles.desktopOnly} />
              <Button
                href={`${PATH.contactSales}${buildQueryString(utmInfo)}`}
                variant='outline'
                className={classNames(styles.desktopOnly, styles.button)}
              >
                Contact Sales
              </Button>
              <Button className={styles.signupButton} href={`${URL.signupUrl}${buildQueryString(utmInfo)}`}>
                Free Trial
              </Button>
              <Button
                label='Mobile Menu'
                className={styles.mobileToggler}
                variant='clear'
                onClick={handleToggleMobileMenu}
              >
                <BurgerSvg className={styles.buttonIcon} />
              </Button>
            </div>
          </nav>
        </Container>
      </div>
      {isMobileMenuOpen && <MobileNavbar />}
    </header>
  )
}
