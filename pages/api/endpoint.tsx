import { NextApiRequest, NextApiResponse } from 'next'
import asana from 'asana'
import { parse } from 'json2csv'

const fields = [
  'resource_type',
  'assignee_created_at',
  'start_on',
  'completed',
  'completed_at',
  'due_on',
  'due_at',
  'name',
  'notes'
]

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = asana.Client.create().useAccessToken(
    process.env.ASANA_API_KEY ?? ''
  )
  const me = await client.users.me()

  const returnValue = await client.tasks.findAll({
    assignee: Number.parseInt(me.gid),
    workspace: me.workspaces[0].gid,
    opt_fields: fields.join(',')
  })

  res.status(200).send(parse(returnValue.data))
}

export default handler
