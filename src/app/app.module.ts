import { BrowserModule } from "@angular/platform-browser"
import { NgModule } from "@angular/core"
import { HttpClientModule } from "@angular/common/http"
import { ReactiveFormsModule } from "@angular/forms"
import { RouterModule, type Routes } from "@angular/router"

import { AppComponent } from "./app.component"
import { PeopleListComponent } from "./components/people-list/people-list.component"
import { PersonEditComponent } from "./components/person-edit/person-edit.component"
import { NavbarComponent } from "./components/navbar/navbar.component"
import { LoadingSpinnerComponent } from "./components/loading-spinner/loading-spinner.component"

const routes: Routes = [
  { path: "", redirectTo: "/people", pathMatch: "full" },
  { path: "people", component: PeopleListComponent },
  { path: "people/edit/:id", component: PersonEditComponent },
  { path: "people/add", component: PersonEditComponent },
  { path: "**", redirectTo: "/people" },
]

@NgModule({
  declarations: [AppComponent, PeopleListComponent, PersonEditComponent, NavbarComponent, LoadingSpinnerComponent],
  imports: [BrowserModule, HttpClientModule, ReactiveFormsModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
