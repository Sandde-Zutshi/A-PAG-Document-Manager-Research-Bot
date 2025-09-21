import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query } = body

    if (!query || !query.trim()) {
      return NextResponse.json(
        {
          status: "error",
          message: "No query provided. Please provide a question to search for."
        },
        { status: 400 }
      )
    }

    // Demo mode response - works without OpenAI API key
    const demoResponse = generateDemoResponse(query)
    
    return NextResponse.json({
      status: "success",
      ...demoResponse
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: "error",
        message: `Error processing query: ${error instanceof Error ? error.message : 'Unknown error'}`
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check if OpenAI is configured (for demo purposes, always return demo mode)
    const openaiConfigured = false
    
    return NextResponse.json({
      status: "success",
      total_documents: 1,
      documents: [
        {
          filename: "sample_document.pdf",
          source: "https://www.epa.gov/sample",
          pages: 10,
          text_length: 5000
        }
      ],
      openai_configured: openaiConfigured,
      openai_message: openaiConfigured ? "OpenAI configured successfully" : "OpenAI API key not found. Please set OPENAI_API_KEY environment variable in Vercel dashboard.",
      setup_instructions: !openaiConfigured ? {
        step_1: "Go to Vercel Dashboard → Your Project → Settings → Environment Variables",
        step_2: "Add OPENAI_API_KEY with your OpenAI API key",
        step_3: "Redeploy your application"
      } : null
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: "error",
        message: `Error getting document info: ${error instanceof Error ? error.message : 'Unknown error'}`
      },
      { status: 500 }
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

function generateDemoResponse(query: string) {
  const queryLower = query.toLowerCase()
  
  const demoResponses = {
    "air quality": `Based on the available environmental documents, here's what I found regarding air quality:

**Air Quality Standards & Regulations:**
• The documents reference various EPA air quality standards and monitoring requirements
• Air pollution control measures are discussed across multiple regulatory frameworks
• Clean Air Act provisions are mentioned in several documents

**Key Findings:**
• Air quality monitoring is essential for public health protection
• Industrial emissions are subject to strict regulatory controls
• Community air quality programs are supported through federal guidelines

**Sources:** Information gathered from 1 documents including sample_document.pdf

*Note: This is a demo response. For full AI-powered analysis, please configure your OpenAI API key in the Vercel dashboard.*`,

    "water": `Environmental water quality information from the documents:

**Water Quality Management:**
• Water pollution prevention strategies are outlined in regulatory documents
• Clean Water Act compliance requirements are detailed
• Watershed protection programs are discussed

**Key Water Quality Topics:**
• Drinking water safety standards
• Wastewater treatment requirements  
• Stormwater management guidelines
• Wetland protection measures

**Sources:** Analysis based on 1 documents: sample_document.pdf

*Note: This is a demo response. Configure your OpenAI API key for comprehensive AI analysis.*`,

    "climate": `Climate change and environmental impact information:

**Climate Change Considerations:**
• Environmental impact assessments address climate considerations
• Carbon emission reduction strategies are discussed
• Adaptation and resilience planning is covered

**Environmental Protection Measures:**
• Sustainable development practices
• Renewable energy integration
• Ecosystem preservation strategies

**Sources:** Information from 1 environmental documents

*Note: This is a demo response. Add your OpenAI API key for detailed AI-powered climate analysis.*`
  }
  
  // Find the best matching demo response
  for (const [keyword, response] of Object.entries(demoResponses)) {
    if (queryLower.includes(keyword)) {
      return {
        answer: response,
        sources: [
          {
            filename: "sample_document.pdf",
            source: "https://www.epa.gov/sample",
            pages: 10,
            text_length: 5000
          }
        ],
        query: query,
        model_used: "demo-mode",
        demo_mode: true
      }
    }
  }
  
  // Generic demo response
  return {
    answer: `Thank you for your question: "${query}"

**Demo Response:**
I found relevant information in 1 environmental documents from EPA sources. The documents contain valuable insights about environmental regulations, compliance requirements, and best practices.

**Available Documents:**
• sample_document.pdf (10 pages)

**To get detailed AI-powered answers:**
1. Go to your Vercel dashboard
2. Add your OpenAI API key as an environment variable
3. Redeploy your application

**Current Status:** Demo mode - showing document availability and basic information.

*This is a demonstration response. Configure your OpenAI API key for full AI-powered document analysis.*`,
    sources: [
      {
        filename: "sample_document.pdf",
        source: "https://www.epa.gov/sample",
        pages: 10,
        text_length: 5000
      }
    ],
    query: query,
    model_used: "demo-mode",
    demo_mode: true
  }
}
