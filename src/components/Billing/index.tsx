import React, { useState, useEffect } from 'react'
import { handlePriceChange, pricingTable } from '../../helpers/pricing'
import Container from '../common/Container'
import Section from '../common/Section'
import RangeSlider, { SliderValue } from '../common/RangeSlider'
import Button from '../common/Button'
import styles from './Billing.module.scss'
import { PATH } from '../../constants/content'
import { Link } from 'gatsby'

const sliderConfig = {
  min: 0,
  max: 5,
  def: 0,
}

export default function Billing() {
  const sliderTable = pricingTable.map(({ label, value }) => {
    return { label, value } as SliderValue
  })

  const defaultValue = 0
  const [sliderValue, setSliderValue] = useState(defaultValue)
  const [monthlyPaymentLabel, setMonthlyPaymentLabel] = useState(pricingTable[defaultValue].label)

  const handleSliderChange = (newValue: number) => {
    setSliderValue(newValue)
    recalculatePricing(sliderTable[newValue].value)
  }

  const recalculatePricing = (value: number) => {
    if (value === Infinity) {
      setMonthlyPaymentLabel('Custom pricing')
      return
    }

    const newPrice = handlePriceChange(value)
    setMonthlyPaymentLabel(newPrice)
  }

  useEffect(() => {
    recalculatePricing(sliderTable[sliderValue].value)
  }, [sliderTable, sliderValue])

  return (
    <Section className={styles.section}>
      <Container size='large'>
        <header className={styles.header}>
          <h2 className={styles.title}>Predictable &amp; Transparent Billing</h2>
        </header>
        <div className={styles.content}>
          <div className={styles.idsPerMonth}>
            <h3 className={styles.title}>How many identification API calls per month do you need?</h3>
            <RangeSlider
              values={sliderTable}
              currentValue={sliderValue}
              config={sliderConfig}
              handleValueChange={handleSliderChange}
            />
            <p className={styles.footnote}>
              Our paid plans come with 90 day visit history and email support.
              <br />
              <br />
              <Link to={PATH.contactSales} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                Contact sales
              </Link>{' '}
              for an enterprise license, 99.9% uptime SLA and 24/7 dedicated support.
            </p>
          </div>
          <div className={styles.payment}>
            <div>
              <span className={styles.price}>{monthlyPaymentLabel} </span>
              {sliderValue !== sliderConfig.max && 'per month'}
            </div>
            {sliderValue !== sliderConfig.max ? (
              <>
                <div className={styles.billed}>billed monthly</div>
                <div className={styles.switcher}>
                  <Button href={PATH.pricingUrl} variant='outline' className={styles.detailedPricing}>
                    Detailed Pricing
                  </Button>
                </div>
                <p className={styles.description}>
                  For annual pricing plans,{' '}
                  <Link to={PATH.contactSales} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                    contact sales
                  </Link>
                </p>
              </>
            ) : (
              <>
                <div className={styles.billed}>talk to our sales team</div>
                <div className={styles.switcher}>
                  <Button href={PATH.contactSales} variant='outline' className={styles.contactSales}>
                    Contact Sales
                  </Button>
                </div>

                <p className={styles.description}>
                  For high traffic websites requiring more than 10M API calls per month, contact our sales team for
                  custom pricing.
                </p>
              </>
            )}
          </div>
        </div>
      </Container>
    </Section>
  )
}
