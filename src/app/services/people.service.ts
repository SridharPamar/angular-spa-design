import { Injectable } from "@angular/core"
import type { HttpClient, HttpErrorResponse } from "@angular/common/http"
import { type Observable, throwError } from "rxjs"
import { catchError } from "rxjs/operators"
import type { Person } from "../models/person.model"

@Injectable({
  providedIn: "root",
})
export class PeopleService {
  // Replace with your actual API URL
  private apiUrl = "https://api.example.com/people"

  constructor(private http: HttpClient) {}

  // Get all people
  getPeople(): Observable<Person[]> {
    return this.http.get<Person[]>(this.apiUrl).pipe(catchError(this.handleError))
  }

  // Get a single person by ID
  getPerson(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError))
  }

  // Add a new person
  addPerson(person: Person): Observable<Person> {
    return this.http.post<Person>(this.apiUrl, person).pipe(catchError(this.handleError))
  }

  // Update an existing person
  updatePerson(person: Person): Observable<Person> {
    return this.http.put<Person>(`${this.apiUrl}/${person.id}`, person).pipe(catchError(this.handleError))
  }

  // Delete a person
  deletePerson(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError))
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = "An unknown error occurred!"

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`
    }

    console.error(errorMessage)
    return throwError(errorMessage)
  }
}
