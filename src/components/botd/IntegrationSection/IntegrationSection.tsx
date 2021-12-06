import React from 'react'
import Container from '../../common/Container'
import { ReactComponent as TopIconSvg } from './svg/TopIconSVG.svg'

import { ReactComponent as CloudfareSvg } from './svg/CloudfareSVG.svg'
import { ReactComponent as AwsSvg } from './svg/AwsSVG.svg'
import { ReactComponent as VercelSvg } from './svg/VercelSVG.svg'
import { ReactComponent as FastlySvg } from './svg/FastlySVG.svg'

import styles from './IntegrationSection.module.scss'

// TODO determine github link
export default function IntegrationSection() {
  return (
    <Container className={styles.container}>
      <TopIconSvg className={styles.topIcon} />
      <h2 className={styles.title}>BotD integrates with all major cloud providers</h2>
      <h3 className={styles.subTitle}>
        Cloud integrations enable BotD to run at edge in a secure context to harden and protect your bot detection
        logic. See for yourself - all cloud integrations are 100% open source.
      </h3>
      <a className={styles.button}>See integrations on GitHub</a>
      <div className={styles.logos}>
        <CloudfareSvg className={styles.logo} />
        <AwsSvg className={styles.logo} />
        <VercelSvg className={styles.logo} />
        <FastlySvg className={styles.logo} />
      </div>
    </Container>
  )
}
