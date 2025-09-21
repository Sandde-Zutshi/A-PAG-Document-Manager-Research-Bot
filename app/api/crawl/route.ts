import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { domain } = body

    if (!domain || !domain.trim()) {
      return NextResponse.json(
        {
          status: "error",
          message: "Domain URL is required for crawling"
        },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(domain)
    } catch {
      return NextResponse.json(
        {
          status: "error",
          message: "Please enter a valid URL (e.g., https://example.com)"
        },
        { status: 400 }
      )
    }

    // Mock response for now - in production this would crawl the actual domain
    const mockFiles = [
      {
        name: "environmental_report.pdf",
        size: 2048000,
        source: domain
      },
      {
        name: "pollution_analysis.pdf", 
        size: 1536000,
        source: domain
      },
      {
        name: "research_findings.pdf",
        size: 1024000,
        source: domain
      }
    ]

    return NextResponse.json({
      status: "success",
      downloaded_files: mockFiles,
      total_files: mockFiles.length,
      message: `Successfully processed ${mockFiles.length} files from ${domain}. Total files in database: ${mockFiles.length}.`,
      crawled_domain: domain
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: "error",
        message: `Error during crawling: ${error instanceof Error ? error.message : 'Unknown error'}`
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      status: "success",
      total_files: 1,
      files: [
        {
          file_name: "sample_document.pdf",
          source_url: "https://www.epa.gov/sample",
          download_date: new Date().toISOString(),
          local_path: "/tmp/sample_document.pdf",
          file_size: 1024000
        }
      ]
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: "error",
        message: `Error getting status: ${error instanceof Error ? error.message : 'Unknown error'}`
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
