import React, { useEffect, useState } from 'react'
import { Form, Grid } from 'semantic-ui-react'

import { TxButton } from './substrate-lib/components'
import { useSubstrateState } from './substrate-lib'

export default function Main (props) {
  const { api } = useSubstrateState()

  const [kittyCnt, setKittyCnt] = useState(0)

  const [status, setStatus] = useState('')

  useEffect(() => {
    let unsubscribe
    api.query.kitties
      .nextKittyId(newValue => {
        // The storage value is an Option<u32>
        // So we have to check whether it is None first
        // There is also unwrapOr
        setKittyCnt (newValue.toNumber())
      })
      .then(unsub => {
        unsubscribe = unsub
      })
      .catch(console.error)

    return () => unsubscribe && unsubscribe()
  }, [api.query.kitties])

  return <Grid.Column width={16}>
    <h1>小毛孩 Count: <span>{kittyCnt}</span></h1>
    <Form style={{ margin: '1em 0' }}>
      <Form.Field style={{ textAlign: 'center' }}>
        <TxButton
          label="Create"
          type='SIGNED-TX'
          setStatus={setStatus}
          attrs={{
            palletRpc: 'kitties',
            callable: 'create',
            inputParams: [],
            paramFields: []
          }}
        />
      </Form.Field>
    </Form>
    <div style={{ overflowWrap: 'break-word' }}>{status}</div>
  </Grid.Column>

}
