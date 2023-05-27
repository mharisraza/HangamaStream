import Base from "@/components/Base";
import { RegisterUser } from "@/services/UserService";
import UserFormData from "@/types/UserFormData";
import Link from "next/link";
import { useRouter } from "next/router";
import { stringify } from "querystring";
import { ChangeEvent, FormEventHandler, useEffect, useState } from "react";
import { isErrored } from "stream";

const Register = () => {

  const router = useRouter();

  const [alert, setAlert] = useState({
    type: '',
    message: '',
  });

    const [data, setData] = useState<UserFormData>({
        email: "",
        password: ""
    });

    const [error, setError] = useState({
        errors: {
          email: '',
          password: '',
        },
        isError: false,
    })

    const handleFieldValueChange = (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setData((prevData) => ({
          ...prevData,
          ...{ [name]: value },
      }));
  
      // Reset error for current field
      setError((prevErrors) => ({
          ...prevErrors,
          ...{ errors: { ...prevErrors.errors, [name]: "" } },
      }));
    }

    const submitForm: FormEventHandler<HTMLFormElement> = (event) => {
      event.preventDefault();

      setError(({
        isError: false,
        errors: {
          email: '',
          password: '',
        }
      }));

        const errors = validate(data);
        if (errors) {
          const filteredErrors = Object.values(errors).filter(Boolean);
          if (filteredErrors.length > 0) {
            setError({
              errors: errors,
              isError: true,
            });
            return;
          }
        }

        RegisterUser(data).then((response) => {
          setData({email: '', password:''})
          router.push('/login');
          setAlert({type: 'success', message: response});
        }).catch((error) => {
          const fieldErrors = error?.response?.data['Field Errors'];
          if(fieldErrors) {
            setError((prevErrors) => ({
              ...prevErrors,
              isError: true,
              errors: fieldErrors,
            }))
            return; // if there are field errors, return early 
          }
          if(error['response'] === undefined) {
            setAlert({type: 'danger', message: 'Something went wrong, please try later.'});
            return;
          }
          setAlert({type: 'danger', message: error?.response?.data?.Error ? error?.response?.data?.Error : error?.response?.data?.Message});
        })
    }

    const validate = (data: UserFormData) => {
        if(data["email"].length === 0) {
            error.errors.email = "Email field is required.";
        }
        if(data["password"].length === 0) {
           error.errors.password = "Password field is required.";
        }
        return error.errors;
    }

  return (
    <>
      <Base title="Register - HangamaStream">
        <div className="container mt-100">
          <div className="row d-flex justify-content-center">
            <div className="col-md-6">
              {alert?.message.length !== 0 && (
                <div className={`alert alert-${alert.type} alert-dismissible fade show`}>
                  {alert.message}
                  <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => setAlert({type: '', message: ''})}>
                      <span aria-hidden="true">&times;</span>
                  </button>
                </div>
              )}
              <div style={{ width: '75%', marginLeft: 'auto', marginRight: 'auto'}} className="card mb-5">
                <div className="card-header text-center fw-bold shadow">Register to HangamaStream</div>
                <div className="card-body">
                  <form onSubmit={submitForm}>

                    <div className="form-group mb-4">
                    <input name="email" type="email" placeholder="Email Address" className={`form-control ${error.errors.email?.length !== 0 ? 'is-invalid' : ''}`} onChange={(e) => handleFieldValueChange(e)} value={data.email}/>

                    <div className="invalid-feedback">
                      {error?.errors.email}
                    </div>
                    </div>

                    <div className="form-group  mb-4">
                    <input name="password" type="password" placeholder="Your Password" className={`form-control ${error.errors.password?.length !== 0 ? 'is-invalid' : ''}`} onChange={(e) => handleFieldValueChange(e)} value={data.password} />

                    <div className="invalid-feedback">{error.errors.password}</div>

                    </div>

                    <div className="container text-center">
                        <button type="submit" className="btn btn-primary w-100 p-2 mb-3 fw-bold">Register</button>
                        <span>Already have an account?</span> <Link href="/login">Login here.</Link>
                    </div>

                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Base>
    </>
  );
};

export default Register;
