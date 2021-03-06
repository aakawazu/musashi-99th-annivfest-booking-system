import { useState } from 'react'
import { useRouter } from 'next/router'
import firebase from 'firebase/app'
import 'firebase/auth'
import { Heading, Box, Form, FormField, TextInput, Text, Select } from 'grommet'
import ButtonLoader from '../components/buttonLoader'
import Layout from '../components/layout'
import { passwordRule } from '../utils/grommet/rules'
import { toDateString } from '../utils/datetime'
import { dates } from '../schedule.json'

export default function SignUp() {
  const router = useRouter()

  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState()

  const datesStr = []
  dates.map(date => {
    datesStr.push({ str: toDateString(date), row: date })
  })

  function signUp(val) {
    setLoading(true)
    setError()
    
    const displayname = val.date.row
    const email = `${val.id}@634-annivfest.jp`
    const password = val.password
    
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => firebase.auth().currentUser.updateProfile({displayName: displayname}))
      .then(() => router.push('/'))
      .catch(err => {
        setLoading(false)
        if(err.code == 'auth/email-already-in-use') {
          setError('このIDはすでに使用されています')
        } else {
          setError(err.message)
        }
      })

  }

  return (
    <Layout>
      <Heading>新規登録</Heading>
      <Form
        onSubmit={({ value }) => {signUp(value)}}
        validate="submit"
      >
        <FormField
          name="id"
          label="ID"
          required
        >
          <TextInput
            name="id"
          />
        </FormField>
        <FormField
          name="password"
          label="パスワード"
          validate={passwordRule}
        >
          <TextInput
            type="password"
            name="password"
          />
        </FormField>
        <FormField
          name="date"
          label="参加日程"
          required
        >
          <Select
            name="date"
            options={datesStr}
            labelKey="str"
          />
        </FormField>
        <Box direction="column" top="large">
          <ButtonLoader label="登録" labelLoad="送信中" isLoading={isLoading} />
        </Box>
      </Form>
      <Box pad="medium">
        <Text color="status-error">
          {error}
        </Text>
      </Box>
    </Layout>
  )
}
