import React from 'react'
import { StaticImage } from 'gatsby-plugin-image'

import Section from '../../common/Section'
import Container from '../../common/Container'
import classNames from 'classnames'

import styles from './ProLayersSection.module.scss'

export default function ProLayersSection() {
  return (
    <Section className={styles.root}>
      <Container className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Pro is Powered By Open Source</h1>
          <h2 className={styles.subtitle}>
            FingerprintJS Pro introduces server-side identification techniques, deduplication analysis, and machine
            learning to generate stable and highly accurate visitorIDs for every web visitor.
          </h2>
        </header>
        <h1 className={styles.proTitle}>FingerprintJS Pro</h1>
        <article className={styles.wrapper}>
          <section className={styles.imageWrapper}>
            <aside className={styles.aside}>
              <div className={styles.server}>Runs on server</div>
              <div className={styles.browser}>Runs in browser</div>
            </aside>
            <StaticImage placeholder='blurred' src='../../../img/proLayers.png' alt='FingerprintJS Pro layers' />
          </section>
          <section className={styles.textWrapper}>
            <Layer title='Server-side analysis and machine learning'>
              Holistic view of all attributes and layers below to generate the most stable and accurate visitorID
            </Layer>
            <Layer title='Storage and deduplication'>
              Stores all attributes collected to do fuzzy matching and handle browser and OS upgrades
            </Layer>
            <Layer title='Cookie and local storage management'>First party cookies and local storage</Layer>
            <Layer title='Browser Fingerprinting Library' oss={true}>
              Generates browser fingerprints from exact matching browser attributes
            </Layer>
          </section>
        </article>
      </Container>
    </Section>
  )
}

interface LayerProps {
  title: string
  children: string
  oss?: boolean
}
function Layer({ title, children, oss }: LayerProps) {
  return (
    <>
      <div className={classNames(styles.layer, { [styles.ossLayer]: oss })}>
        {oss && <h1 className={styles.ossTitle}>Open Source</h1>}
        <h1 className={styles.layerTitle}>{title}</h1>
        <h2 className={styles.layerSubtitle}>{children}</h2>
      </div>
    </>
  )
}
