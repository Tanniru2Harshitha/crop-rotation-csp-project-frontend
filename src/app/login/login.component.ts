import { Component ,OnInit , NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormControl,FormGroup, Validators } from '@angular/forms';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
 loginForm = new FormGroup({
  email: new FormControl("", [Validators.required , Validators.email]),
  password: new FormControl("", [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(15)
  ]),
 });
 username: any;
 password: any;
 constructor(private http: HttpClient, private router: Router, private ngZone: NgZone) { }
 ngOnInit() {
  this.loadGoogleSignInApi();
}
loadGoogleSignInApi() {
  const script = document.createElement('script');
  script.src = 'https://apis.google.com/js/platform.js';
  script.async = true;
  script.defer = true;
  script.onload = () => {
    gapi.load('auth2', () => {
      gapi.auth2.init({
        client_id: '365233047221-ck1j0l6jb8gqthf151si71ta5to5hsap.apps.googleusercontent.com',
        cookie_policy: 'single_host_origin'
      });
    });
  };
  document.head.appendChild(script);
}
loginSubmited() {
  this.http.post('http://localhost:3000/login', { username: this.username, password: this.password })
    .subscribe((response: any) => {
      console.log(response);
      // Handle the login response
      if (response.success) {
        this.redirectToHome();
      } else {
        alert("Invalid credentials");
      }
    });
}
onSignIn() {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signIn().then((googleUser: any) => {
    const id_token = googleUser.getAuthResponse().id_token;
    // Send the id_token to your server for verification and further processing
  
    // Example: sending the id_token to the server using HttpClient
    this.http.post('http://localhost:3000/google-login', { id_token })
      .subscribe((response: any) => {
        console.log(response);
        // Handle the login response from the server
        if (response.success) {
          this.redirectToHome();
        } else {
          
        }
      });
  }).catch((error: any) => {
    console.log(error);
    
  });
}

redirectToHome() {
  this.ngZone.run(() => {
    this.router.navigate(['../home']);
  });
}

}