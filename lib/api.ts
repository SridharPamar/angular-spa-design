import type { Person } from "@/types/person"

// Mock data for demonstration
const mockPeople: Person[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1-555-0123",
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "+1-555-0456",
    address: "456 Oak Ave, Somewhere, USA",
  },
  {
    id: 3,
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob.johnson@example.com",
    phone: "+1-555-0789",
  },
]

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// API functions
export const peopleApi = {
  // Get all people
  async getPeople(): Promise<Person[]> {
    await delay(800) // Simulate network delay
    return [...mockPeople]
  },

  // Get a single person by ID
  async getPerson(id: number): Promise<Person | null> {
    await delay(500)
    return mockPeople.find((person) => person.id === id) || null
  },

  // Add a new person
  async addPerson(person: Omit<Person, "id">): Promise<Person> {
    await delay(600)
    const newPerson = {
      ...person,
      id: Math.max(...mockPeople.map((p) => p.id)) + 1,
    }
    mockPeople.push(newPerson)
    return newPerson
  },

  // Update an existing person
  async updatePerson(person: Person): Promise<Person> {
    await delay(600)
    const index = mockPeople.findIndex((p) => p.id === person.id)
    if (index === -1) {
      throw new Error("Person not found")
    }
    mockPeople[index] = person
    return person
  },

  // Delete a person
  async deletePerson(id: number): Promise<void> {
    await delay(500)
    const index = mockPeople.findIndex((p) => p.id === id)
    if (index === -1) {
      throw new Error("Person not found")
    }
    mockPeople.splice(index, 1)
  },
}
