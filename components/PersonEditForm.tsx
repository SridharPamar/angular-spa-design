"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Person } from "@/types/person"
import { peopleApi } from "@/lib/api"
import Navbar from "@/components/Navbar"
import LoadingSpinner from "@/components/LoadingSpinner"
import "./person-edit.css"

interface PersonEditFormProps {
  personId?: number
}

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
}

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
}

export default function PersonEditForm({ personId }: PersonEditFormProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const router = useRouter()
  const isEditMode = !!personId

  useEffect(() => {
    if (isEditMode) {
      loadPerson()
    }
  }, [personId])

  const loadPerson = async () => {
    try {
      setLoading(true)
      setError(null)
      const person = await peopleApi.getPerson(personId!)
      if (person) {
        setFormData({
          firstName: person.firstName,
          lastName: person.lastName,
          email: person.email,
          phone: person.phone || "",
          address: person.address || "",
        })
      } else {
        setError("Person not found")
      }
    } catch (err) {
      setError("Failed to load person details. Please try again later.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    } else if (formData.firstName.length > 50) {
      newErrors.firstName = "First name cannot exceed 50 characters"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    } else if (formData.lastName.length > 50) {
      newErrors.lastName = "Last name cannot exceed 50 characters"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (formData.phone && !/^\+?[0-9\s\-()]{7,20}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Mark all fields as touched
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
    })

    if (!validateForm()) {
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      const personData: Omit<Person, "id"> = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        address: formData.address.trim() || undefined,
      }

      if (isEditMode) {
        await peopleApi.updatePerson({ ...personData, id: personId! })
      } else {
        await peopleApi.addPerson(personData)
      }

      router.push("/people")
    } catch (err) {
      setError(`Failed to ${isEditMode ? "update" : "add"} person. Please try again later.`)
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Navbar title="People Management" />
      <div className="content-container">
        <div className="person-edit-container">
          <h1>{isEditMode ? "Edit Person" : "Add Person"}</h1>

          {error && <div className="error-message">{error}</div>}

          {loading && <LoadingSpinner />}

          {!loading && (
            <form onSubmit={handleSubmit} className="person-form">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  onBlur={() => handleBlur("firstName")}
                  className={errors.firstName && touched.firstName ? "invalid" : ""}
                />
                {errors.firstName && touched.firstName && <div className="error-hint">{errors.firstName}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  onBlur={() => handleBlur("lastName")}
                  className={errors.lastName && touched.lastName ? "invalid" : ""}
                />
                {errors.lastName && touched.lastName && <div className="error-hint">{errors.lastName}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={errors.email && touched.email ? "invalid" : ""}
                />
                {errors.email && touched.email && <div className="error-hint">{errors.email}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  onBlur={() => handleBlur("phone")}
                  className={errors.phone && touched.phone ? "invalid" : ""}
                />
                {errors.phone && touched.phone && <div className="error-hint">{errors.phone}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={() => router.push("/people")}>
                  Cancel
                </button>
                <button type="submit" className="submit-button" disabled={submitting}>
                  {submitting ? "Saving..." : isEditMode ? "Update" : "Save"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
