import { Component, type OnInit } from "@angular/core"
import type { PeopleService } from "../../services/people.service"
import type { Person } from "../../models/person.model"

@Component({
  selector: "app-people-list",
  templateUrl: "./people-list.component.html",
  styleUrls: ["./people-list.component.css"],
})
export class PeopleListComponent implements OnInit {
  people: Person[] = []
  loading = true
  error: string = null

  constructor(private peopleService: PeopleService) {}

  ngOnInit() {
    this.loadPeople()
  }

  loadPeople() {
    this.loading = true
    this.peopleService.getPeople().subscribe(
      (data) => {
        this.people = data
        this.loading = false
      },
      (error) => {
        this.error = "Failed to load people. Please try again later."
        this.loading = false
        console.error(error)
      },
    )
  }

  deletePerson(id: number) {
    if (confirm("Are you sure you want to delete this person?")) {
      this.loading = true
      this.peopleService.deletePerson(id).subscribe(
        () => {
          this.people = this.people.filter((person) => person.id !== id)
          this.loading = false
        },
        (error) => {
          this.error = "Failed to delete person. Please try again later."
          this.loading = false
          console.error(error)
        },
      )
    }
  }
}
