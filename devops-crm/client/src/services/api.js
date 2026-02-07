const BASE_URL = '/api'

// Filter out undefined/null/empty values from params
const cleanParams = (params) => {
  const cleaned = {}
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      cleaned[key] = value
    }
  }
  return cleaned
}

class ApiService {
  async request(method, url, data = null, options = {}) {
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // For cookies
    }
    
    if (data) {
      config.body = JSON.stringify(data)
    }
    
    let fullUrl = `${BASE_URL}${url}`
    if (options.params) {
      const cleaned = cleanParams(options.params)
      if (Object.keys(cleaned).length > 0) {
        fullUrl += `?${new URLSearchParams(cleaned)}`
      }
    }
    
    const response = await fetch(fullUrl, config)
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }))
      const err = new Error(error.error || 'Request failed')
      err.response = { data: error, status: response.status }
      throw err
    }
    
    return { data: await response.json(), status: response.status }
  }
  
  get(url, options = {}) {
    return this.request('GET', url, null, options)
  }
  
  post(url, data, options = {}) {
    return this.request('POST', url, data, options)
  }
  
  put(url, data, options = {}) {
    return this.request('PUT', url, data, options)
  }
  
  delete(url, options = {}) {
    return this.request('DELETE', url, null, options)
  }
}

export default new ApiService()
