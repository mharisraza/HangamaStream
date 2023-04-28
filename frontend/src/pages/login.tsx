import Base from "@/components/Base";
import { LoginUser } from "@/services/UserService";
import UserFormData from "@/types/UserFormData";
import Link from "next/link";
import { useRouter } from "next/router";
import { stringify } from "querystring";
import { ChangeEvent, FormEventHandler, useState } from "react";

const Login = () => {

  const router = useRouter();

  const [alert, setAlert] = useState({
    type: "",
    message: "",
  });

  const [data, setData] = useState<UserFormData>({
    email: "",
    password: "",
  });

  const [error, setError] = useState({
    errors: {
      email: "",
      password: "",
    },
    isError: false,
  });

  const handleFieldValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setData((prevData) => ({
      ...prevData,
      ...{ [name]: value },
    }));

    setError((prevErrors) => ({
      ...prevErrors,
      ...{ errors: { ...prevErrors.errors, [name]: "" } },
    }))

  };

  const submitForm: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

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

    LoginUser(data)
      .then((response) => {
        localStorage.setItem("jwtToken", response.token);
        router.push('/');
      })
      .catch((error) => {
        console.log("Error response" + error['response'])
        if(error['response'] === undefined) {
          setAlert({type: 'danger', message: 'Something went wrong, please try later.'})
          return;
        } 
        setAlert({type: 'danger', message: error?.response?.data?.Error ? error.response.data.Error : error?.response?.data?.Message})
      });
  };

  const validate = (data: UserFormData) => {
    if (data["email"].length === 0) {
      error.errors["email"] = "Email is required.";
    }
    if (data["password"].length === 0) {
      error.errors["password"] = "Password is required.";
    }
    return error.errors;
  };

  return (
    <>
      <Base title="Login - HangamaStream">
        <div className="container mt-100">
          <div className="row d-flex justify-content-center">
            <div className="col-md-6">
              {alert?.message.length !== 0 && (
                <div
                  className={`alert alert-${alert.type} alert-dismissible fade show`}
                >
                  {alert.message}
                  <button
                    type="button"
                    className="close"
                    data-dismiss="alert"
                    aria-label="Close"
                    onClick={() => setAlert({ type: "", message: "" })}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
              )}
              <div className="card mb-5">
                <div className="card-header">Login</div>
                <div className="card-body">
                  <form onSubmit={submitForm}>
                    <div className="form-group mb-4">
                      <label>Email Address</label>
                      <input
                        name="email"
                        type="text"
                        placeholder="Email Address"
                        className={`form-control ${
                          error?.errors?.email.length !== 0 ? "is-invalid" : ""
                        }`}
                        onChange={(event) => handleFieldValueChange(event)}
                        value={data.email}
                      />

                      <div className="invalid-feedback">
                        {error?.errors?.email}
                      </div>
                    </div>

                    <div className="form-group  mb-4">
                      <label>Password</label>
                      <input
                        name="password"
                        type="password"
                        placeholder="Your Password"
                        className={`form-control ${error?.errors?.password.length !== 0 ? "is-invalid" : ""}`}
                        onChange={(event) => handleFieldValueChange(event)}
                        value={data.password}
                      />

                      <div className="invalid-feedback">
                        {error?.errors?.password}
                      </div>
                    </div>

                    <div className="container text-center">
                      <button type="submit" className="btn btn-primary w-100 p-2 mb-3">
                        Login
                      </button>
                      <span>Forgor your password? Reset now</span>
                      <br />
                      <span className="m">Don't you have an account?</span>
                      <Link href="/register">Register Here.</Link>
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

export default Login;
