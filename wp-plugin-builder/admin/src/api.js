import axios from 'axios'

const restBase = (typeof WPB_DATA !== 'undefined' && WPB_DATA.rest_url) ? WPB_DATA.rest_url : (window.location.origin + '/wp-json/wpb/v1/')

const defaultHeaders = () => {
  const headers = { 'Content-Type': 'application/json' }
  if (typeof WPB_DATA !== 'undefined' && WPB_DATA.nonce) {
    headers['X-WP-Nonce'] = WPB_DATA.nonce
  }
  return headers
}

export async function listProjects() {
  const url = restBase + 'list_projects'
  const res = await axios.get(url, { headers: defaultHeaders(), withCredentials: true })
  return res.data
}

export async function newProject(name = 'Untitled') {
  const url = restBase + 'new_project'
  const res = await axios.post(url, { name }, { headers: defaultHeaders(), withCredentials: true })
  return res.data
}

export async function loadProject(id) {
  const url = restBase + 'load_project?id=' + encodeURIComponent(id)
  const res = await axios.get(url, { headers: defaultHeaders(), withCredentials: true })
  return res.data
}

export async function saveProject(id, data) {
  const url = restBase + 'save_project'
  const res = await axios.post(url, { id, data }, { headers: defaultHeaders(), withCredentials: true })
  return res.data
}
