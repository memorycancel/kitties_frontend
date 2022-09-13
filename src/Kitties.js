import React, { useEffect, useState } from 'react'
import { Form, Grid } from 'semantic-ui-react'

import { TxButton } from './substrate-lib/components'
import { useSubstrateState } from './substrate-lib'

import KittyCards from './KittyCards';

export default function Kitties (props) {
  const { api, keyring } = useSubstrateState()
  const { accountPair } = props;
  const [kittyCnt, setKittyCnt] = useState(0)
  const [kittyDNAs, setKittyDNAs] = useState([]);
  const [kittyOwners, setKittyOwners] = useState([]);
  const [kitties, setKitties] = useState([]);
  const [status, setStatus] = useState('')

  useEffect(() => {
    let unsubscribe
    api.query.kitties
      .nextKittyId(newValue => {
        setKittyCnt(newValue.toNumber())
      })
      .then(unsub => {
        unsubscribe = unsub
      })
      .catch(console.error)

    return () => unsubscribe && unsubscribe()
  }, [api.query.kitties.nextKittyId, keyring])

  useEffect(() => {
    const kittyIndices = [...Array(kittyCnt).keys()];
    let unsubscribe
    api.query.kitties.kittyOwner.multi(
      kittyIndices,
      owners => setKittyOwners(owners.map(owner => owner.toHuman()))
    )
    .then(unsub => {
      unsubscribe = unsub
    })
    .catch(console.error)

    return () => unsubscribe && unsubscribe()
  }, [api.query.kitties.kittyOwner, kittyOwners])

  useEffect(() => {
    const kittyIndices = [...Array(kittyCnt).keys()];
    let unsubscribe
    api.query.kitties.kitties.multi(
      kittyIndices,
      dnas => setKittyDNAs(dnas.map(dna => dna.value.toU8a()))
    )
    .then(unsub => {
      unsubscribe = unsub
    })
    .catch(console.error)

    return () => unsubscribe && unsubscribe()
  }, [api.query.kitties.kitties, kittyDNAs])

  useEffect(() => {
    const kittyIndices = [...Array(kittyCnt).keys()];
    const kitties = kittyIndices.map(ind => ({
      id: ind,
      dna: kittyDNAs[ind],
      owner: kittyOwners[ind],
    }));
    setKitties(kitties);
  }, [kittyDNAs, kittyOwners])

  console.log(kitties)

  return <Grid.Column width={16}>
    <h1>小毛孩 Count: <span>{kittyCnt}</span></h1>
    <KittyCards kitties={kitties} accountPair={accountPair} setStatus={setStatus}/>
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
