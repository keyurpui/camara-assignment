import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AssignmentsComponent } from "../container/assignments/assignments.component";

const routes: Routes = [
  { path: "assignments", component: AssignmentsComponent },
  { path: "", redirectTo: "assignments", pathMatch: "full" },
  { path: "**", redirectTo: "assignments", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
