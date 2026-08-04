export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')

  const username = 'CodewithDubey'

  // Query 1 — solved counts + ranking
  const query1 = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        submitStats {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
          totalSubmissionNum {
            difficulty
            count
            submissions
          }
        }
        profile {
          ranking
        }
      }
    }
  `

  // Query 2 — streak and active days
  const query2 = `
    query getUserStreak($username: String!) {
      streakCounter {
        streakCount
        daysSkipped
        currentDayCompleted
      }
      matchedUser(username: $username) {
        userCalendar {
          streak
          totalActiveDays
        }
      }
    }
  `

  try {
    const [r1, r2] = await Promise.all([
      fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'https://leetcode.com',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        body: JSON.stringify({ query: query1, variables: { username } }),
      }),
      fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'https://leetcode.com',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        body: JSON.stringify({ query: query2, variables: { username } }),
      }),
    ])

    const d1 = await r1.json()
    const d2 = await r2.json()

    const acStats    = d1?.data?.matchedUser?.submitStats?.acSubmissionNum    ?? []
    const totalStats = d1?.data?.matchedUser?.submitStats?.totalSubmissionNum ?? []

    const ac    = acStats.find(s => s.difficulty === 'All')    ?? {}
    const easy  = acStats.find(s => s.difficulty === 'Easy')   ?? {}
    const med   = acStats.find(s => s.difficulty === 'Medium') ?? {}
    const hard  = acStats.find(s => s.difficulty === 'Hard')   ?? {}
    const total = totalStats.find(s => s.difficulty === 'All') ?? {}

    const calendar   = d2?.data?.matchedUser?.userCalendar ?? {}
    const totalSolved = ac.count ?? 0

    res.status(200).json({
      totalSolved,
      easySolved:       easy.count         ?? 0,
      mediumSolved:     med.count          ?? 0,
      hardSolved:       hard.count         ?? 0,
      totalSubmissions: total.submissions  ?? ac.submissions ?? 0,
      acceptanceRate:   total.submissions
        ? Math.round((totalSolved / total.submissions) * 100 * 10) / 10
        : 0,
      ranking:          d1?.data?.matchedUser?.profile?.ranking ?? 0,
      streak:           calendar.streak         ?? 0,
      activeDays:       calendar.totalActiveDays ?? 0,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
