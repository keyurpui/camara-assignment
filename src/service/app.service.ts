import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AssignmentsDTO } from "../types/assignment.type";

@Injectable()
export class AppService {
  constructor(private http: HttpClient) {}

  mockData = "../assets/mock-data/assignment.json";

  getAssignments(): Observable<AssignmentsDTO> {
    return this.http.get<AssignmentsDTO>(this.mockData);
  }
}
