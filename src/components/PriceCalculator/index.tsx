import React, { useState } from 'react'
import Select from '../common/Select'
import classNames from 'classnames'
import { minimumIdentifications, freeApiCalls, pricingTable, calculatePrice } from '../../helpers/pricing'
import Button from '../../components/common/Button'
import { numberFormatter } from '../../helpers/format'
import styles from './PriceCalculator.module.scss'
import { PATH } from '../../constants/content'

export default function PriceCalculator() {
  const selectOptions = pricingTable.map((entry) => ({
    label: entry.value === Infinity ? `${numberFormatter.format(10000000)}+` : numberFormatter.format(entry.value),
    value: entry.value,
  }))

  const [selectedPreset, setSelectedPreset] = useState(selectOptions[0])
  const [customCount, setCustomCount] = useState<number | undefined>(undefined)

  const isCustomPricing =
    (!customCount && selectedPreset.value === Infinity) || (customCount && customCount >= 10000000)
  const isFree = (!customCount && selectedPreset.value === freeApiCalls) || (customCount && customCount <= freeApiCalls)

  function onPresetSelected(newPreset: ValuePreset): void {
    setSelectedPreset(newPreset)

    // A preset was selected, clear the custom count.
    setCustomCount(undefined)
  }

  function onCustomCountChanged(newCustomCount: string): void {
    if (newCustomCount !== '') {
      const strippedValue = newCustomCount.replace(/\.|,/, '')

      setCustomCount(parseInt(strippedValue, 10))
    } else {
      setCustomCount(undefined)
    }
  }

  function getPrice() {
    return customCount === undefined
      ? calculatePrice(selectedPreset.value)
      : calculatePrice(customCount >= minimumIdentifications ? customCount : minimumIdentifications)
  }

  function getPriceValue() {
    if (isFree) {
      return '$0'
    } else if (isCustomPricing) {
      return 'Custom'
    } else {
      return getPrice()
    }
  }

  return (
    <div className={styles.wrapper}>
      <Column title='How many identifications per month do you need?'>
        <div className={styles.presetSelector}>
          <div className={styles.description}>
            <strong>Select from preset</strong>
          </div>
          <Select<ValuePreset>
            value={customCount === undefined ? selectedPreset : null}
            options={selectOptions}
            onChange={onPresetSelected}
          />
        </div>
        <div className={styles.customInput}>
          <div className={styles.description}>Or type a specific number</div>
          <input
            value={customCount ?? ''}
            onChange={(e) => onCustomCountChanged(e.target.value)}
            type='number'
            name='identification-user-input'
            placeholder='ex. 630,000'
          />
        </div>
      </Column>
      <Column title={'On-Demand'}>
        <Price
          value={getPriceValue()}
          description={isFree ? 'Free up to 20,000 monthly API calls' : 'Pay as you go, cancel any time'}
        />
      </Column>
      <Column title='Annual'>
        <div className={styles.description}>Requires a 12 month prepay</div>
        <Button variant='outline' size='small' href={PATH.contactSales}>
          Contact Sales
        </Button>
      </Column>
      <Column title='Enterprise License'>
        {isCustomPricing ? (
          <div className={styles.description}>Custom pricing for high traffic websites</div>
        ) : (
          <div className={styles.description}>Enterprise support license with SLA</div>
        )}
        <Button variant='outline' size='small' href={PATH.contactSales}>
          Contact Sales
        </Button>
      </Column>
    </div>
  )
}

interface ColumnProps {
  title: string
  children: React.ReactNode
}

function Column({ title, children }: ColumnProps) {
  return (
    <div className={styles.column}>
      <div className={classNames(styles.row, styles.header)}>{title}</div>
      <div className={styles.row}>{children}</div>
    </div>
  )
}

interface PriceProps {
  value: string
  description: string
}

function Price({ value, description }: PriceProps) {
  return (
    <>
      <div className={styles.price}>
        <div className={styles.value}>{value}</div>
        <div className={styles.subtitle}>per month</div>
      </div>
      <div className={styles.description}>{description}</div>
    </>
  )
}

interface ValuePreset {
  label: string
  value: number
}
