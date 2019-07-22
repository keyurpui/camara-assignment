import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { AppService } from "./../../service/app.service";
import { Assignment, AssignmentsDTO } from "./../../types/assignment.type";

@Component({
  selector: "app-assignments",
  templateUrl: "./assignments.component.html",
  styleUrls: ["./assignments.component.less"]
})
export class AssignmentsComponent implements OnInit {
  assignmentsDto: AssignmentsDTO;
  searchField: FormControl;
  visibleAssignments: Assignment[];
  display: string = "none";
  alertDisplay: string = "none";
  newAssignmentForm: FormGroup;
  alertMessage: string;
  selectedAssignment: Assignment = null;
  pointer: number = 915;

  constructor(private _service: AppService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this._service.getAssignments().subscribe(assignmentsDto => {
      sessionStorage.setItem("assignmentsDto", JSON.stringify(assignmentsDto));
      this.assignmentsDto = JSON.parse(
        sessionStorage.getItem("assignmentsDto")
      );
      this.visibleAssignments = JSON.parse(
        sessionStorage.getItem("assignmentsDto")
      ).assignments;
    });

    this.formInit();
  }

  formInit(): void {
    this.searchField = new FormControl();
    this.searchField.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(term => {
        this.visibleAssignments = this.filteredAssignments(
          term,
          this.assignmentsDto.assignments
        );
      });
  }

  filteredAssignments(query: string, entities: Assignment[]): Assignment[] {
    const lowerCaseQuery = query.toLowerCase();
    const assignments = entities;
    return assignments.filter(assignment =>
      ["cameraId", "vehicleId", "id"].some(
        key =>
          assignment[key]
            .toString()
            .toLowerCase()
            .indexOf(lowerCaseQuery) > -1
      )
    );
  }

  openModalDialog(selectedAssignment: Assignment = null): void {
    this.selectedAssignment = selectedAssignment;
    this.newAssignmentForm = this.formBuilder.group({
      camera: [
        selectedAssignment ? selectedAssignment.cameraId : null,
        [Validators.required]
      ],
      vehicle: [
        selectedAssignment ? selectedAssignment.vehicleId : null,
        [Validators.required]
      ]
    });
    this.alertDisplay = "none";
    this.display = "block";
  }

  closeModalDialog(): void {
    this.alertDisplay = "none";
    this.display = "none";
  }

  deleteAssignment(assignment: Assignment) {
    const updatedAssignmentDto = (
      assignmentDto: AssignmentsDTO = this.assignmentsDto
    ): AssignmentsDTO => ({
      ...assignmentDto,
      assignments: assignmentDto["assignments"].filter(
        entity => entity.id !== assignment.id
      )
    });

    sessionStorage.setItem(
      "assignmentsDto",
      JSON.stringify(updatedAssignmentDto())
    );
    this.assignmentsDto = JSON.parse(sessionStorage.getItem("assignmentsDto"));
    this.visibleAssignments = JSON.parse(
      sessionStorage.getItem("assignmentsDto")
    ).assignments;
  }

  onCreateAssignment(): void {
    const formValue = this.newAssignmentForm.value;
    if (
      this.assignmentsDto["assignments"].some(assignment =>
        this.selectedAssignment && assignment.id === this.selectedAssignment.id
          ? false
          : assignment.cameraId === formValue.camera ||
            assignment.vehicleId === formValue.vehicle
      )
    ) {
      this.alertMessage = "Please select different combination.";
      this.alertDisplay = "block";
    } else {
      this.display = "none";
      this.alertDisplay = "none";
      if (this.selectedAssignment) {
        const updatedAssignmentDto = (
          assignmentDto: AssignmentsDTO = this.assignmentsDto
        ): AssignmentsDTO => ({
          ...assignmentDto,
          assignments: assignmentDto["assignments"].map(entity => {
            if (entity.id === this.selectedAssignment.id) {
              return {
                ...entity,
                cameraId: formValue.camera,
                vehicleId: formValue.vehicle
              };
            }
            return entity;
          })
        });
        sessionStorage.setItem(
          "assignmentsDto",
          JSON.stringify(updatedAssignmentDto())
        );
      } else {
        const updatedAssignmentDto = (
          assignmentDto: AssignmentsDTO = this.assignmentsDto
        ): AssignmentsDTO => ({
          ...assignmentDto,
          assignments: assignmentDto["assignments"].concat({
            id: ++this.pointer,
            cameraId: formValue.camera,
            vehicleId: formValue.vehicle,
            dateCreated: "12/22/22",
            deleted: true
          })
        });

        sessionStorage.setItem(
          "assignmentsDto",
          JSON.stringify(updatedAssignmentDto())
        );
      }

      this.assignmentsDto = JSON.parse(
        sessionStorage.getItem("assignmentsDto")
      );

      this.visibleAssignments = JSON.parse(
        sessionStorage.getItem("assignmentsDto")
      ).assignments;
    }
  }
}
