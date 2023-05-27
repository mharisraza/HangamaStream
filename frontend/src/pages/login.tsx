import Base from "@/components/Base";
import { LoginUser } from "@/services/UserService";
import UserFormData from "@/types/UserFormData";
import Link from "next/link";
import { useRouter } from "next/router";
import { stringify } from "querystring";
import { ChangeEvent, FormEventHandler, useContext, useState } from "react";

const Login = () => {

  const router = useRouter();

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
        localStorage.setItem("token", response.token);
      })
      .catch((error) => {
        if(error['response'] === undefined) {
          return;
        } 
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
              <div style={{ width: '75%', marginLeft: 'auto', marginRight: 'auto' }} className="card mb-5 shadow">
                <div className="card-header text-center shadow fw-bold">Login to Hangama</div>
                <div className="card-body">
                  <form onSubmit={submitForm}>
                    <div className="form-group mb-4">
                      <input
                        name="email"
                        type="text"
                        placeholder="Email Address"
                        className={`form-control mt-1 ${
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
                      <button type="submit" className="btn btn-primary w-100 p-2 mb-3 fw-bold">
                        Login <i className="fas fa-sign-in"></i>
                      </button>
                      <br />
                      <span>Forgor your password? Reset now</span>
                      <br />

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
