import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserProfile } from '../models/userProfile.model';
import { Observable } from 'rxjs';
import { ChangePassword } from '../models/changePassword.model';


@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = 'https://localhost:7071/api/Customers';

  constructor(private http: HttpClient) {}

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}/Profile`);
  }

  updateProfile(profile: UserProfile): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/Profile`, profile);
  }
 changePassword(data: ChangePassword): Observable<void> {
  return this.http.put<void>(this.baseUrl + '/ChangePassword', data);
}

}
