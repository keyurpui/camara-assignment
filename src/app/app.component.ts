import { Component, OnInit } from "@angular/core";
import { AppService } from "../service/app.service";
import { AssignmentsDTO } from "../types/assignment.type";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.less"]
})
export class AppComponent implements OnInit {

  constructor(private _service: AppService) {}

  ngOnInit() {}
}
