// pages/api/media.ts
import { NextApiRequest, NextApiResponse } from 'next'

const mockMedia = Array.from({ length: 100 }).map((_, i) => ({
  id: i.toString(),
  type: i % 3 === 0 ? 'video' : 'image',
  url: i % 3 === 0
    ? 'https://www.w3schools.com/html/mov_bbb.mp4'
    : `https://picsum.photos/id/${i + 10}/600/400`,
  thumbnailUrl: `https://picsum.photos/id/${i + 10}/300/200`,
  title: `מדיה #${i + 1}`,
  tags: ['חיילים', 'שטח', i % 3 === 0 ? 'וידאו' : 'תמונה'],
  uploadedAt: new Date().toISOString(),
}))

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { type, offset = 0, limit = 20 } = req.query
  let filtered = mockMedia

  if (type === 'image' || type === 'video') {
    filtered = filtered.filter((item) => item.type === type)
  }

  const start = Number(offset)
  const end = start + Number(limit)
  res.status(200).json(filtered.slice(start, end))
}
