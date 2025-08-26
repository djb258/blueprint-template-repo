import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Read the CTB blueprint YAML file
      const blueprintPath = path.join(process.cwd(), 'ctb_blueprint.yaml')
      const yamlContent = fs.readFileSync(blueprintPath, 'utf-8')
      
      res.status(200).send(yamlContent)
    } catch (error) {
      console.error('Failed to read CTB blueprint:', error)
      res.status(500).json({ error: 'Failed to load blueprint' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}