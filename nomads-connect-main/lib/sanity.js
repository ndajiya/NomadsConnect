import sanityClient from '@sanity/client'



export const client = sanityClient({
  projectId: '8bn4jrjx',
  dataset: 'production',
  apiVersion: 'v1',
  token:'sksbf5vBb3AUbxYwamhht6nwHFR5T20In9Zsdgvo0snAx5u195YesHY0Vr02gof4Kp6Eg22AyHERJAxR5F0ZNWkN5olyIoUzz8w5UjiDQ4hqCIB7yhDUHRqHuh4AzhYNjdbGXO6HScbC4jx8ERsNfAiEJc2W3wycLQxvTy5oHYVHH3HXZSBW',
  useCdn: false,
})
