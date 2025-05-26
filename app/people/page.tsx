"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Person } from "@/types/person"
import { peopleApi } from "@/lib/api"
import Navbar from "@/components/Navbar"
import LoadingSpinner from "@/components/LoadingSpinner"
import "./people-list.css"

export default function PeopleListPage() {
  const [people, setPeople] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadPeople()
  }, [])

  const loadPeople = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await peopleApi.getPeople()
      setPeople(data)
    } catch (err) {
      setError("Failed to load people. Please try again later.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const deletePerson = async (id: number) => {
    if (confirm("Are you sure you want to delete this person?")) {
      try {
        setLoading(true)
        await peopleApi.deletePerson(id)
        setPeople(people.filter((person) => person.id !== id))
      } catch (err) {
        setError("Failed to delete person. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <>
      <Navbar title="People Management" />
      <div className="content-container">
        <div className="people-list-container">
          <div className="header">
            <h1>People List</h1>
            <Link href="/people/add" className="add-button">
              Add Person
            </Link>
          </div>

          {error && <div className="error-message">{error}</div>}

          {loading && <LoadingSpinner />}

          {!loading && !error && (
            <>
              {people.length === 0 ? (
                <div className="empty-state">
                  <p>No people found. Click "Add Person" to create a new entry.</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="people-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {people.map((person) => (
                        <tr key={person.id}>
                          <td>{person.id}</td>
                          <td>{person.firstName}</td>
                          <td>{person.lastName}</td>
                          <td>{person.email}</td>
                          <td>{person.phone || "N/A"}</td>
                          <td className="actions">
                            <Link href={`/people/edit/${person.id}`} className="edit-button">
                              Edit
                            </Link>
                            <button className="delete-button" onClick={() => deletePerson(person.id)}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
