const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000'

async function handleRequest(request, { params }) {
  const pathSegments = params.path || []
  const apiPath = pathSegments.join('/')
  const searchParams = request.nextUrl.searchParams.toString()
  const queryString = searchParams ? `?${searchParams}` : ''
  const backendUrl = `${BACKEND_URL}/api/${apiPath}${queryString}`

  const headers = new Headers()
  request.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase()
    // Remove cache-related headers to prevent 304 responses
    if (!['host', 'connection', 'content-length', 'cf-connecting-ip', 'cf-ray', 'if-none-match', 'if-modified-since', 'cache-control'].includes(lowerKey)) {
      headers.set(key, value)
    }
  })
  
  // Add cache control headers to prevent caching
  headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
  headers.set('Pragma', 'no-cache')
  headers.set('Expires', '0')

  let body = undefined
  const contentType = request.headers.get('content-type') || ''

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    try {
      if (contentType.includes('application/json')) {
        const json = await request.json()
        body = JSON.stringify(json)
        headers.set('Content-Type', 'application/json')
      } else {
        body = await request.text()
        if (contentType) {
          headers.set('Content-Type', contentType)
        }
      }
    } catch (error) {
      console.error('Error reading request body:', error)
      return Response.json({ error: 'Failed to read request body' }, { status: 400 })
    }
  }

  const fetchHeaders = {}
  headers.forEach((value, key) => {
    fetchHeaders[key] = value
  })

  try {
    const fetchOptions = {
      method: request.method,
      headers: fetchHeaders,
    }
    
    if (body !== undefined) {
      fetchOptions.body = body
    }

    const response = await fetch(backendUrl, fetchOptions)
    const responseContentType = response.headers.get('content-type') || ''
    const responseHeaders = new Headers()
    
    response.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase()
      if (!['content-encoding', 'transfer-encoding', 'content-length', 'etag', 'last-modified'].includes(lowerKey)) {
        responseHeaders.set(key, value)
      }
    })
    
    // Override cache control headers to prevent caching
    responseHeaders.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    responseHeaders.set('Pragma', 'no-cache')
    responseHeaders.set('Expires', '0')
    responseHeaders.set('Surrogate-Control', 'no-store')
    
    responseHeaders.set('Access-Control-Allow-Origin', '*')
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    responseHeaders.set('Access-Control-Allow-Credentials', 'true')
    
    if (responseContentType.includes('application/json')) {
      const data = await response.json()
      return Response.json(data, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      })
    } else {
      const data = await response.text()
      return new Response(data, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      })
    }
  } catch (error) {
    console.error('Proxy error:', error, 'URL:', backendUrl)
    return Response.json({ error: 'Proxy request failed', details: error.message }, {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
  }
}

export async function GET(request, context) {
  return handleRequest(request, context)
}

export async function POST(request, context) {
  return handleRequest(request, context)
}

export async function PUT(request, context) {
  return handleRequest(request, context)
}

export async function DELETE(request, context) {
  return handleRequest(request, context)
}

export async function PATCH(request, context) {
  return handleRequest(request, context)
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  })
}
