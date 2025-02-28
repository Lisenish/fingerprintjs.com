import React from 'react'
import Container from '../../common/Container'
import CodeWindowWithSelector, { CodeTooltip } from '../../common/CodeWindowWithSelector'
import { SuccessResponse } from '../../../types/botResponse'

import styles from './APIResponseDetailsSection.module.scss'

interface APIResponseDetailsSectionProps {
  visitorData?: SuccessResponse
}

export default function APIResponseDetailsSection({ visitorData }: APIResponseDetailsSectionProps) {
  const characterLength = 8.4

  return (
    <Container className={styles.container}>
      <h1 className={styles.title} id='ApiResponseDetails'>
        API response details
      </h1>
      <div className={styles.root}>
        <section className={styles.snippetSection}>
          <CodeWindowWithSelector
            codeBlocks={[
              {
                code: `{
  "bot":{
      "automationTool":{
        "status":"${visitorData?.bot.automationTool.status ?? 'processed'}",
        "probability":${visitorData?.bot.automationTool.probability ?? 0}
      },
      "browserSpoofing":{
        "status":"${visitorData?.bot.browserSpoofing.status ?? 'processed'}",
        "probability":${visitorData?.bot.browserSpoofing.probability ?? 0}
      },
      "searchEngine":{
        "status":"${visitorData?.bot.searchEngine.status ?? 'processed'}",
        "probability":${visitorData?.bot.searchEngine.probability ?? 0}
      }
  },
  "vm":{
      "status":"${visitorData?.vm.status ?? 'processed'}",
      "probability":${visitorData?.vm.probability ?? 0}
  },
  "ip":"${visitorData?.ip ?? '186.XXX.XXX.XXX'}",
  "requestId":"${visitorData?.requestId ?? '01FP8C8FQ8P189KVFP88C5FHY5'}",
  "verifyCounter": ${visitorData?.verifyCounter ?? '1'},
  "tag":"${visitorData?.tag ?? ''}"
}`,
                language: 'javascript',
                type: '',
              },
            ]}
            className={styles.apiJson}
            tooltips={[
              <CodeTooltip key='automationTool' className={styles.automationTool}>
                <p>
                  <strong>Automation tool detection</strong> is helpful when you need to know if your website is used by
                  things like Puppeteer, Playwright and Selenium. These tools are used to create fake reviews, scrape
                  your premium content and mass-register fake user accounts.
                </p>
              </CodeTooltip>,
              <CodeTooltip key='browserSpoofing' className={styles.browserSpoofing}>
                <p>
                  <strong>Browser spoofing detection</strong> is helpful to know when headless browsers pretend to be
                  regular iPhones or Android devices.
                </p>
              </CodeTooltip>,
              <CodeTooltip key='searchEngine' className={styles.searchEngine}>
                <p>
                  <strong>Search engine detection</strong> is important to know which bots should be ignored, because
                  they&apos;re good and which should be protected against, because they&apos;re bad.
                </p>
              </CodeTooltip>,
              <CodeTooltip key='vm' className={styles.vm}>
                <p>
                  <strong>Virtual machine detection</strong> is useful to detect click farms, automated review fraud and
                  junk content generation. It&apos;s a strong signal that improves the reliability and accuracy of the
                  previous three detectors.
                </p>
              </CodeTooltip>,
              <CodeTooltip
                key='ip'
                className={styles.ip}
                left={visitorData?.ip ? 139 + visitorData.ip.length * characterLength : 265}
              >
                <p>
                  <strong>Client IP address.</strong>
                </p>
              </CodeTooltip>,
              <CodeTooltip
                key='requestId'
                className={styles.requestId}
                left={visitorData?.requestId ? 199 + visitorData.requestId.length * characterLength : 417}
              >
                <p>
                  <strong>Request ID</strong> is used to verify bot detection requests on the server.
                </p>
              </CodeTooltip>,
              <CodeTooltip
                key='verifyCounter'
                className={styles.verifyCounter}
                left={
                  visitorData?.verifyCounter ? 232 + visitorData.verifyCounter.toString().length * characterLength : 232
                }
              >
                <p>
                  <strong>Verify counter</strong> is the number of verify calls for the request Id. You can use it to
                  prevent{' '}
                  <a
                    className={styles.link}
                    href='https://github.com/fingerprintjs/BotD/discussions/54'
                    target='_blank'
                    rel='noreferrer'
                  >
                    replay attacks
                  </a>
                  .
                </p>
              </CodeTooltip>,
              <CodeTooltip
                key='tag'
                className={styles.tag}
                left={visitorData?.tag ? 142 + visitorData.tag.length * characterLength : 142}
              >
                <p>
                  <strong>Tag</strong> is a string containing information associated with each request. Should be
                  provided by BotD users in the browser API.
                </p>
              </CodeTooltip>,
            ]}
          />
        </section>
        <section className={styles.details}>
          <h2 className={styles.detailsTitle}>
            BotD comes with four useful detectors: automation tools, search engine, browser spoofing and virtual machine
            detection.
          </h2>
          <p className={styles.description}>
            Each detector result comes with a probability that you can use to make granular decisions about blocking or
            mitigation strategies.
          </p>
        </section>
      </div>
    </Container>
  )
}
