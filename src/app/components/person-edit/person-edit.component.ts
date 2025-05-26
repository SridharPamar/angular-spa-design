import { Component, type OnInit } from "@angular/core"
import { type FormBuilder, type FormGroup, Validators } from "@angular/forms"
import type { ActivatedRoute, Router } from "@angular/router"
import type { PeopleService } from "../../services/people.service"
import type { Person } from "../../models/person.model"

@Component({
  selector: "app-person-edit",
  templateUrl: "./person-edit.component.html",
  styleUrls: ["./person-edit.component.css"],
})
export class PersonEditComponent implements OnInit {
  personForm: FormGroup
  personId: number
  isEditMode = false
  loading = false
  submitting = false
  error: string = null

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private peopleService: PeopleService,
  ) {}

  ngOnInit() {
    this.createForm()

    // Check if we're in edit mode by looking for an ID in the route
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.personId = +params["id"]
        this.isEditMode = true
        this.loadPerson(this.personId)
      }
    })
  }

  createForm() {
    this.personForm = this.fb.group({
      firstName: ["", [Validators.required, Validators.maxLength(50)]],
      lastName: ["", [Validators.required, Validators.maxLength(50)]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", Validators.pattern(/^\+?[0-9\s\-$$$$]{7,20}$/)],
      address: ["", Validators.maxLength(200)],
    })
  }

  loadPerson(id: number) {
    this.loading = true
    this.peopleService.getPerson(id).subscribe(
      (person) => {
        this.personForm.patchValue(person)
        this.loading = false
      },
      (error) => {
        this.error = "Failed to load person details. Please try again later."
        this.loading = false
        console.error(error)
      },
    )
  }

  onSubmit() {
    if (this.personForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.personForm.controls).forEach((key) => {
        const control = this.personForm.get(key)
        control.markAsTouched()
      })
      return
    }

    this.submitting = true
    const personData: Person = {
      ...this.personForm.value,
      id: this.isEditMode ? this.personId : null,
    }

    const request = this.isEditMode
      ? this.peopleService.updatePerson(personData)
      : this.peopleService.addPerson(personData)

    request.subscribe(
      () => {
        this.submitting = false
        this.router.navigate(["/people"])
      },
      (error) => {
        this.error = `Failed to ${this.isEditMode ? "update" : "add"} person. Please try again later.`
        this.submitting = false
        console.error(error)
      },
    )
  }

  // Helper methods for form validation
  get firstName() {
    return this.personForm.get("firstName")
  }
  get lastName() {
    return this.personForm.get("lastName")
  }
  get email() {
    return this.personForm.get("email")
  }
  get phone() {
    return this.personForm.get("phone")
  }
}
