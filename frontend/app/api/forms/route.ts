import { NextResponse } from 'next/server'
import { mockForms } from './mockDb'

export async function GET() {
  try {
    const forms = Array.from(mockForms.values())
    return NextResponse.json(forms)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newId = (mockForms.size + 1).toString()
    
    const newForm = {
      ...body,
      id: newId,
      fields: body.fields || []
    }

    mockForms.set(newId, newForm)
    return NextResponse.json(newForm, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 