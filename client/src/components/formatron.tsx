import React, { useState, useEffect } from "react";

var formState = {};
interface FormValidator {
  [key: string]: number;
}
var formValidator: FormValidator = {};
var list = {};
var trySubmit = false;

const excludeListDataAttr = (obj: object) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([k, v]) => k.slice(0, 4) !== "data")
  );
};

const validateForm = () => {
  return Object.values(formValidator).reduce((a, b) => a + b, 0) === 0;
};

const removeInvalidFromClassName = (props, classListToRemove) => {
  return Object.fromEntries(
    Object.entries(props).map((entry: any[]) => [
      entry[0],
      entry[0] === "className"
        ? entry[1]
            .split(" ")
            .filter((oneClass) => !classListToRemove.includes(oneClass))
            .join(" ")
        : entry[1],
    ])
  );
};

const markAsInvalid = (props, flag) => {
  props = removeInvalidFromClassName(props, ["invalid", "valid"]);
  if (flag) props.className += " invalid";
  else props.className += " valid";
  return props;
};

const markAsRequired = (props, addListProps) => {
  props = removeInvalidFromClassName(props, ["required"]);
  if ("data-required" in addListProps) props.className += " required";
  return props;
};

const validateInput = (fieldState, name) => {
  let error: string = "";
  const regex: string =
    name in list && "data-pattern" in list[name]
      ? list[name]["data-pattern"]
      : "(.)*";
  if (fieldState && !new RegExp(`^${regex}$`, "is").test(fieldState)) {
    error =
      name in list && "data-error-message" in list[name]
        ? list[name]["data-error-message"]
        : "input must match allowed characters";
  } else {
    if (name in list && fieldState === "" && "data-required" in list[name])
      error =
        "data-required-message" in list[name]
          ? list[name]["data-required-message"]
          : "field is required";
  }
  formValidator[name] = error ? 1 : 0;
  return error ? <div className="error-message">{error}</div> : "";
};

const innerOptions = (props) => {
  return Object.entries(
    Object.fromEntries(
      Object.entries(props).filter(
        ([k, v]: any[]) => k.slice(0, 11) === "data-option"
      )
    )
  ).map(([k, v]: any[], index) => {
    return k === "data-option" ? (
      <option key={index} value={k.slice(12)} disabled>
        {v}
      </option>
    ) : (
      <option key={index}>{v}</option>
    );
  });
};

const Field = (props) => {
  const [fieldState, setFieldState] = useState(
    "name" in props && props.name in formState
      ? formState[props.name]
      : "value" in props
      ? props.value
      : ""
  );
  const changeState = (e) => {
    formState[props.name] =
      "type" in props && ["checkbox", "radio"].includes(props.type)
        ? e.target.checked
          ? "true"
          : ""
        : props.name in list && "data-trim" in list[props.name]
        ? e.target.value.trim()
        : e.target.value;
    setFieldState(formState[props.name]);
  };
  const addListProps =
    "name" in props && props.name in list ? list[props.name] : {};
  const tagName = "data-as" in addListProps ? addListProps["data-as"] : "input";
  const innerText =
    "data-text" in addListProps ? addListProps["data-text"] : null;
  const options = innerOptions(addListProps);
  props = markAsRequired(props, addListProps);

  props = {
    ...props,
    ...excludeListDataAttr(addListProps),
  };
  if (!("data-text" in addListProps))
    props = {
      ...props,
      onChange: changeState,
      value: fieldState,
    };
  const error =
    ("name" in props && props.name in formState) ||
    (trySubmit && "name" in props)
      ? validateInput(fieldState, props.name)
      : "";
  if (fieldState !== "" || trySubmit) props = markAsInvalid(props, error);
  if (
    "type" in props &&
    ["checkbox", "radio"].includes(props.type) &&
    fieldState === "true"
  )
    props.defaultChecked = true;
  return (
    <>
      {"data-as" in addListProps ? (
        React.createElement(tagName, props, innerText, options)
      ) : (
        <input {...props} />
      )}
      {error}
    </>
  );
};

const submitForm = (formRef) => {
  formRef.submit();
};

const checkClear = (e) => {
  return e.target.type && e.target.type === "reset" ? true : false;
};

const Formatron = (props) => {
  const [formComponentState, setFormComponentState] = useState(
    props.form.props.children
  );
  const [validSubmit, setValidSubmit] = useState(2);

  useEffect(() => {
    setFormComponentState(props.form.props.children);
  }, [props.form.props.children]);

  const action = "action" in props ? props.action : "/";
  const method = "method" in props ? props.method : "post";
  if ("list" in props) list = props.list;
  const FormBody = ({ componentsList }) => componentsList;

  return (
    <form
      autoComplete="off"
      method={method}
      action={action}
      onClick={(e) => {
        if (checkClear(e) && validSubmit > 0) {
          trySubmit = false;
          formState = {};
          setValidSubmit(new Date().getTime());
        }
      }}
      onSubmit={(e) => {
        trySubmit = true;
        e.preventDefault();
        setTimeout(() => {
          if (validateForm())
            if ("onSubmit" in props && props.onSubmit(formState))
              submitForm(e.target);
        }, 0);
        setValidSubmit(new Date().getTime());
        return;
      }}
    >
      <FormBody componentsList={formComponentState} />
    </form>
  );
};
export { Formatron, Field };
