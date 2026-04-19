import fs from 'fs'
import path from 'path'

export interface PersonaFAQ {
  question: string
  answer: string
}

export interface Persona {
  slug: string
  title: string
  metaDescription: string
  h1: string
  intro: string
  topPickSlug: string
  productSlugs: string[]
  productNotes: Record<string, string>
  requirements: string
  whyThisMatters: string
  faq: PersonaFAQ[]
  lastUpdated: string
}

const PERSONAS_DIR = path.join(process.cwd(), 'content', 'personas')

export function getAllPersonas(): Persona[] {
  if (!fs.existsSync(PERSONAS_DIR)) return []
  const files = fs.readdirSync(PERSONAS_DIR).filter(f => f.endsWith('.json'))
  return files.map(file => {
    const raw = fs.readFileSync(path.join(PERSONAS_DIR, file), 'utf-8')
    return JSON.parse(raw) as Persona
  })
}

export function getPersonaBySlug(slug: string): Persona | null {
  const personas = getAllPersonas()
  return personas.find(p => p.slug === slug) ?? null
}
