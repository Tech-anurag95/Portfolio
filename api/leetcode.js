export default async function handler(req, res) {
  // Allow CORS from your own site
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')

  const username = 'CodewithDubey'

  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        submitStats {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
        }
        profile {
          ranking
        }
      }
      userContestRanking(username: $username) {
        attendedContestsCount
      }
    }
  `

  try {
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
        'User-Agent': 'Mozilla/5.0',
      },
      body: JSON.stringify({ query, variables: { username } }),
    })

    if (!response.ok) throw new Error(`LeetCode API error: ${response.status}`)

    const data = await response.json()
    const stats = data?.data?.matchedUser?.submitStats?.acSubmissionNum ?? []

    const all    = stats.find(s => s.difficulty === 'All')    ?? {}
    const easy   = stats.find(s => s.difficulty === 'Easy')   ?? {}
    const medium = stats.find(s => s.difficulty === 'Medium') ?? {}
    const hard   = stats.find(s => s.difficulty === 'Hard')   ?? {}

    res.status(200).json({
      totalSolved:      all.count         ?? 0,
      easySolved:       easy.count        ?? 0,
      mediumSolved:     medium.count      ?? 0,
      hardSolved:       hard.count        ?? 0,
      totalSubmissions: all.submissions   ?? 0,
      ranking:          data?.data?.matchedUser?.profile?.ranking ?? 0,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
