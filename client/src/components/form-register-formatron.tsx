import React, { useState } from "react";
import { Formatron, Field } from "./formatron";
import ConsentMessage from "./consent-message";

interface InputListMap {
  [key: string]: string | boolean;
}
interface ListMap {
  [key: string]: InputListMap;
}
const list: ListMap = {
  name: {
    type: "text",
    placeholder: "First name",
    "data-pattern": "[a-z ]+",
    "data-required": true,
    "data-trim": true,
    "data-error-message": "name must contain only alphabetic characters",
    maxLength: "100",
  },
  surname: {
    type: "text",
    placeholder: "Surname",
    "data-pattern": "[a-z ]+",
    "data-required": true,
    "data-trim": true,
    "data-error-message": "name must contain only alphabetic characters",
    maxLength: "100",
  },
  email: {
    type: "text",
    placeholder: "Email",
    "data-required": true,
    "data-trim": true,
    "data-pattern":
      "[a-zA-Z0-9_\\.\\-]+@[a-zA-Z0-9\\-]+\\.([a-zA-Z]{3}|[a-zA-Z]{2}\\.[a-zA-Z0-9]{2})",
    "data-error-message": "please provide a valid email address",
    maxLength: "100",
  },
  country: {
    "data-as": "select",
    "data-pattern": "(.)+",
    "data-option": "Country",
    "data-required": true,
    maxLength: "100",
  },
  labelPassword: {
    "data-as": "label",
    "data-text": "New password",
    className: "mt-2 text-start text-black py-2 col-12 px-2",
  },
  password: {
    type: "password",
    placeholder: "******",
    "data-pattern": "[a-z-A-Z0-9}]{8,12}",
    "data-required": true,
    "data-trim": true,
    "data-error-message":
      "password must be 8 - 12 characters, letters and numbers",
    maxLength: "30",
  },
};

const getInputGroupLeftOrRight = (start: number, end?: number) => {
  if (!end) end = Object.keys(list).length;
  return Object.keys(list)
    .slice(start, end)
    .map((name) => {
      return (
        <Field
          key={name}
          name={name}
          className="form-control col-12 col-md-6"
        />
      );
    });
};

const getCountriesList = async () => {
  return await fetch("https://restcountries.com/v3.1/all", {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
  })
    .then((result) => result.json())
    .then((result) => {
      return result;
    });
};

const keepOnlyOptions = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([k, v]) => k.slice(0, 11) === "data-option")
  );
};

const FormRegisterFormatron = (props) => {
  const [countriesList, setCountriesList] = useState(
    getInputGroupLeftOrRight(3, 4)
  );
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const addDefaultOneCountry = () => {
    if (!("data-option-afg" in list.country)) {
      list.country[`data-option-afg`] = `🇦🇫  Afghanistan`;
      setCountriesList(getInputGroupLeftOrRight(3, 4));
    }
  };

  "environment" in props && /test/.test(props.environment)
    ? addDefaultOneCountry()
    : getCountriesList().then((result) => {
        if (Object.keys(keepOnlyOptions(list.country)).length === 1) {
          result
            .sort((a, b) => a.name.common.localeCompare(b.name.common))
            .forEach((character) => {
              list.country[
                `data-option-${character.fifa}`
              ] = `${character.flag}  ${character.name.common}`;
            });
          setCountriesList(getInputGroupLeftOrRight(3, 4));
        }
      });

  const FormComponentsLeft = getInputGroupLeftOrRight(0, 3);
  const FormComponentsRight = getInputGroupLeftOrRight(4, 6);

  return (
    <div id="contact-form">
      <h2 className="text-start mt-4 mb-4 mt-md-0 mb-md-1">Sign up</h2>
      {submitSuccess ? <div id="form-data-submited">...</div> : ""}
      <Formatron
        onSubmit={(data) => {
          setSubmitSuccess(true);

          console.log(JSON.stringify(data));

          return true;
        }}
        method="get"
        action="/members"
        list={list}
        form={
          <>
            <div className="row">
              <div className="col-12 col-md-6">
                {FormComponentsLeft}
                {countriesList}
              </div>
              <div className="col-12 col-md-6">{FormComponentsRight}</div>

              <div className="col-12 col-md-6 mt-0 ">
                <div className="col-12 m-end-3 px-3 mb-1">
                  <ConsentMessage />
                </div>
              </div>
              <div className="col-12 col-md-6 mt-0 me-md-3">
                <button
                  type="submit"
                  className="btn btn-primary btn-md btn-block col-12 pt-2"
                >
                  Register
                </button>
              </div>
              <div className="col-12 col-md-6 mt-3 me-md-3 text-right">
                <button
                  type="reset"
                  className="btn btn-block clearForm mx-auto col-12 float-end pt-2 px-4"
                >
                  Clear form
                </button>
              </div>
            </div>
          </>
        }
      />
    </div>
  );
};

export { FormRegisterFormatron, list };
