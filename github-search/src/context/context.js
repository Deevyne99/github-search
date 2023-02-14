import React, { useState, useEffect, createContext } from 'react'
import mockUser from './mockData.js/mockUser'
import mockRepos from './mockData.js/mockRepos'
import mockFollowers from './mockData.js/mockFollowers'
import axios from 'axios'

const rootUrl = 'https://api.github.com'
const GithubContext = createContext()

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser)
  const [repos, setRepos] = useState(mockRepos)
  const [followers, setFollowers] = useState(mockFollowers)
  //request
  const [requests, setRequests] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState({ show: false, msg: '' })
  //check request
  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let {
          rate: { remaining },
        } = data
        setRequests(remaining)
        // remaining = 0
        if (remaining === 0) {
          toggleError(true, 'sorry you have exceeded your hourly rate limit!')
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
  function toggleError(show = false, msg = '') {
    setError({ show, msg })
  }
  const searchUser = async (user) => {
    setLoading(true)
    toggleError()
    const response = await axios(`${rootUrl}/users/${user}`).catch((err) =>
      console.log(err)
    )
    console.log(response.data)
    if (response) {
      setGithubUser(response.data)
      const { login, followers_url } = response.data

      await Promise.allSettled([
        axios(`${rootUrl}/users/${login}/repos?per_page = 100`),
        axios(`${followers_url}/per_page=100`),
      ])
        .then((results) => {
          const [repos, followers] = results
          const status = 'fulfilled'
          if (repos.status === status) {
            setRepos(repos.value.data)
          }
          if (followers.status === status) {
            setRepos(followers.value.data)
          }
        })
        .catch((err) => console.log(err))
    } else {
      toggleError(true, 'there is no user with that username')
    }
    checkRequests()
    setLoading(false)
  }
  useEffect(checkRequests, [])
  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        searchUser,
        loading,
      }}
    >
      {children}
    </GithubContext.Provider>
  )
}
export { GithubProvider, GithubContext }
