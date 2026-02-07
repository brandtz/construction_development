const BASE_URL = '/api/investor'

class ApiService {
  async request(method, url, data = null, options = {}) {
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    }
    
    if (data) {
      config.body = JSON.stringify(data)
    }
    
    let fullUrl = `${BASE_URL}${url}`
    if (options.params) {
      const cleaned = {}
      for (const [key, value] of Object.entries(options.params)) {
        if (value !== undefined && value !== null && value !== '') {
          cleaned[key] = value
        }
      }
      if (Object.keys(cleaned).length > 0) {
        fullUrl += `?${new URLSearchParams(cleaned)}`
      }
    }
    
    const response = await fetch(fullUrl, config)
    const responseData = await response.json()
    
    if (!response.ok) {
      throw new Error(responseData.error || 'An error occurred')
    }
    
    return responseData
  }
  
  get(url, options = {}) {
    return this.request('GET', url, null, options)
  }
  
  post(url, data) {
    return this.request('POST', url, data)
  }
  
  put(url, data) {
    return this.request('PUT', url, data)
  }
  
  delete(url) {
    return this.request('DELETE', url)
  }
}

export default new ApiService()
