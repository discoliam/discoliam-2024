require('dotenv').config()

const path = require('path')
const axios = require('axios')
const { AssetCache } = require('@11ty/eleventy-fetch')

let foldersData = []
let asset = new AssetCache('folders')

async function requestReleases(pageKey = 1) {
  let url = `https://api.discogs.com/users/discoliam/collection/folders?token=${process.env.DISCOG_TOKEN}&page=${pageKey}&per_page=100&sort=artist`

  try {
    const response = await axios.get(url)
    foldersData.push(...response.data.folders)
  } catch (error) {
    console.error(error)
  }
}

module.exports = async function () {
  // If saved in cache, return that instead of fetching all the data
  if (asset.isCacheValid('8h')) {
    return asset.getCachedValue()
  }

  return await requestReleases().then(() => {
    asset.save(foldersData, 'json')
    return foldersData
  })
}
