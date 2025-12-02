const BACKEND_URL = process.env.BACKEND_URL || 'https://whitecarrot-server.vercel.app'

async function handleRequest(request, { params }) {
  const pathSegments = params.path || []
  const apiPath = pathSegments.join('/')
  const searchParams = request.nextUrl.searchParams.toString()
  const queryString = searchParams ? `?${searchParams}` : ''
  const backendUrl = `${BACKEND_URL}/api/${apiPath}${queryString}`

  const headers = {}
  request.headers.forEach((value, key) => {
    if (!['host', 'connection'].includes(key.toLowerCase())) {
      headers[key] = value
    }
  })

  const requestOptions = {
    method: request.method,
    headers: headers,
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    try {
      const contentType = request.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        const json = await request.json()
        requestOptions.body = JSON.stringify(json)
        headers['Content-Type'] = 'application/json'
      } else {
        requestOptions.body = await request.text()
      }
    } catch (error) {
      console.error('Error reading request body:', error)
    }
  }

  try {
    const response = await fetch(backendUrl, requestOptions)
    const contentType = response.headers.get('content-type') || ''
    const responseHeaders = new Headers()
    
    response.headers.forEach((value, key) => {
      if (!['content-encoding', 'transfer-encoding'].includes(key.toLowerCase())) {
        responseHeaders.set(key, value)
      }
    })
    responseHeaders.set('Access-Control-Allow-Origin', '*')
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    responseHeaders.set('Access-Control-Allow-Credentials', 'true')
    
    if (contentType.includes('application/json')) {
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
    console.error('Proxy error:', error)
    return Response.json({ error: 'Proxy request failed' }, {
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

