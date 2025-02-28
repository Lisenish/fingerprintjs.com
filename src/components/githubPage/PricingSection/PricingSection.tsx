import React from 'react'
import Section from '../../common/Section'
import Container from '../../common/Container'
import Button from '../../common/Button'
import { DEFAULT_TRIAL_DAYS, PATH } from '../../../constants/content'

import styles from './PricingSection.module.scss'

export default function PricingSection() {
  const list = (
    <ul className={styles.bulletList}>
      <li>Transparent pricing</li>
      <li>Monthly and annual plans</li>
      <li>Unlimited API calls for {DEFAULT_TRIAL_DAYS} days</li>
      <li>Money back guarantee</li>
    </ul>
  )

  return (
    <Section className={styles.root}>
      <Container className={styles.container}>
        <section className={styles.pricingSide}>
          <h1 className={styles.title}>
            Pro plans start
            <br />
            at $0/month
          </h1>
          <article className={styles.listOnPricingSide}>{list}</article>
          <Button href={PATH.pricingUrl} variant='outline' className={styles.button}>
            See Detailed Pricing
          </Button>
        </section>
        <section className={styles.benefitSide}>{list}</section>
      </Container>
    </Section>
  )
}
