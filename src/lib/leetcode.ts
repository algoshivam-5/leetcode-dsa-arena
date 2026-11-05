export interface LeetCodeSubmission {
  title: string;
  titleSlug: string;
  timestamp: string;
  statusDisplay: string;
  lang: string;
}

export interface LeetCodeUserProfile {
  username: string;
  realName?: string;
  userAvatar?: string;
  ranking?: number;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  recentSubmissions: LeetCodeSubmission[];
}

export async function fetchLeetCodeProfile(username: string): Promise<LeetCodeUserProfile | null> {
  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          realName
          userAvatar
          ranking
        }
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
      recentAcSubmissionList(username: $username, limit: 15) {
        title
        titleSlug
        timestamp
        statusDisplay
        lang
      }
    }
  `;

  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://leetcode.com",
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
      next: { revalidate: 300 }, // 5 min cache
    });

    if (!response.ok) {
      console.warn(`LeetCode GraphQL responded with status ${response.status}`);
      return null;
    }

    const data = await response.json();
    if (!data.data?.matchedUser) {
      return null;
    }

    const matched = data.data.matchedUser;
    const acStats = matched.submitStats?.acSubmissionNum || [];

    const totalSolved = acStats.find((s: any) => s.difficulty === "All")?.count || 0;
    const easySolved = acStats.find((s: any) => s.difficulty === "Easy")?.count || 0;
    const mediumSolved = acStats.find((s: any) => s.difficulty === "Medium")?.count || 0;
    const hardSolved = acStats.find((s: any) => s.difficulty === "Hard")?.count || 0;

    return {
      username: matched.username,
      realName: matched.profile?.realName,
      userAvatar: matched.profile?.userAvatar,
      ranking: matched.profile?.ranking,
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      recentSubmissions: data.data.recentAcSubmissionList || [],
    };
  } catch (error) {
    console.warn("LeetCode fetch error:", error);
    return null;
  }
}

