import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  genders = ['male', 'female'];
  signupForm: FormGroup;
  forbiddenUsernames = ['Chris', 'Anna'];

  ngOnInit() {
    this.signupForm = new FormGroup({
      //YOU CAN MAKE A SECONDARY FORM GROUP IF YOU WANT; in html also add a div surrounding the inputs with formGroupName="userData" then it would be userData.username in html
      // 'userData': new FormGroup({
      //   'username': new FormControl(null, Validators.required),
      //   'email': new FormControl(null, [Validators.required, Validators.email]),
      //   'gender': new FormControl('male'),
      // }),
      'username': new FormControl(null, [Validators.required, this.forbiddenNames.bind(this)]),
      //third argument is for async validators from a server; in this case forbiddenEmails
      'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmails),
      'gender': new FormControl('male'),
      'hobbies': new FormArray([]) 
    });
    //will show any changes made to form: can also use just on one control
    this.signupForm.valueChanges.subscribe(
      (value) => console.log(value)
    );
    //will give you the status of the form: valid, pending, invalid, etc. 
    this.signupForm.statusChanges.subscribe(
      (status) => console.log(status)
    );
    //give all fields default values
    this.signupForm.setValue({
      'username': 'bill',
      'email': 'test@test3.com',
      'gender': 'male',
      'hobbies': [],
    });
    //only give value to one of form fields
    this.signupForm.patchValue({
      'username': 'kyle'
    })
  }

  onSubmit() {
    console.log(this.signupForm);
    //clear all fields
    this.signupForm.reset();
  }

  onAddHobby() {
    const control = new FormControl(null, Validators.required);
    //have to tell typescript that this is formArray; explictly cast this;
    (<FormArray>this.signupForm.get('hobbies')).push(control)
  }

  //CREATE A CUSTOM VALIDATOR TO SEE IF USERNAME IS CHRIS OR ANNA
  forbiddenNames(control: FormControl): {[s: string]: boolean} {
    if (this.forbiddenUsernames.indexOf(control.value) !== -1) {
      return {'nameIsForbidden': true};
    }
    return null;
  }

  //async get errors from a server
  forbiddenEmails(control: FormControl): Promise<any> | Observable<any> {
    const mockPromiseFromServer = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        if (control.value === 'test@test.com') {
          //promises don't return you resolve
          resolve({'emailIsForbidden': true});
        } else {
          resolve(null);
        }
      }, 1500);
    });
    return mockPromiseFromServer;
  }
}
