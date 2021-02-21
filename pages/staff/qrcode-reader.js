import dynamic from 'next/dynamic'
import { useState } from 'react'
import fetcher from '../../utils/swr/fetcher'
import { Heading, Text } from 'grommet'
import { toString } from '../../utils/datetime'

const BarcodeReader = dynamic(() => import('react-qr-reader'), {
  ssr: false,
})

export default function QRcodeReader() {
  const [code, setCode] = useState()
  const [showEventInfo, setShowEventInfo] = useState()
  const [showError, setShowError] = useState()

  return (
    <>
      <BarcodeReader
        style={{ width: '50%' }}
        delay={300}
        onScan={async result => {
          const resultStr = `${result}`
          if(result && (resultStr != code)) {
            setCode(resultStr)
            const data = await fetcher(`/api/staff/booking-info?id=${result}`)
            if(!data.error) {
              setShowEventInfo(data)
            } else {
              setShowError(data)
            }
          }
        }}
      />

      {showError && (
        <>
          <Heading>エラー</Heading>
          <Text>{showError.error}</Text>
        </>
      )}

      {showEventInfo && (
        <>
          <Heading>{showEventInfo.event}</Heading>
          <Text size="xlarge">{toString(showEventInfo.datetime)}</Text>
          <br/><br/>
          <Text size="large">ID : {showEventInfo.username}</Text>
        </>
      )}
    </>
  )
}