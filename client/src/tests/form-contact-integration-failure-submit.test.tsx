import {
  render,
  fireEvent,
  screen,
  queryByAttribute,
} from "@testing-library/react";
import React, { Component } from "react";
import { act } from "react-dom/test-utils";
import {
  FormRegisterFormatron,
  list,
} from "../components/form-register-formatron";
var listClone = JSON.parse(JSON.stringify(list));
jest.setTimeout(30000);

const scenario = async (block) => {
  await act(async () => {
    for (const component of Object.keys(listClone)) {
      if ("shouldNotSubmit" in listClone[component]) {
        const field = block.container.querySelectorAll(`[name='${component}']`);
        fireEvent.change(field[0], {
          target: { value: listClone[component].shouldNotSubmit },
        });
      }
    }
  });
  await act(async () => {
    const submitButton = screen.getByRole("button", {
      name: /register/i,
    });
    fireEvent.click(submitButton);
  });
  await act(async () => {
    await new Promise((r) => setTimeout(r, 1000));
  });
};

describe("checks submit is failing", () => {
  const getById = queryByAttribute.bind(null, "id");

  test("name field holds invalid data", async () => {
    listClone.name.shouldNotSubmit = "Ray1";
    listClone.surname.shouldNotSubmit = "Kan";
    listClone.email.shouldNotSubmit = "asd@asd.com";
    listClone.country.shouldNotSubmit = "🇦🇫 Afghanistan";
    listClone.password.shouldNotSubmit = [...new Array(10)]
      .map(() => "a")
      .join("");

    const block = render(<FormRegisterFormatron environment="testing" />);
    await scenario(block);
    expect(
      getById(block.container, "form-data-submited")
    ).not.toBeInTheDocument();
  });

  test("surname field holds invalid data", async () => {
    listClone.name.shouldNotSubmit = "Ray";
    listClone.surname.shouldNotSubmit = "Kan1";
    listClone.email.shouldNotSubmit = "asd@asd.c";
    listClone.country.shouldNotSubmit = "🇦🇫 Afghanistan";
    listClone.password.shouldNotSubmit = [...new Array(10)]
      .map(() => "a")
      .join("");

    const block = render(<FormRegisterFormatron environment="testing" />);
    await scenario(block);
    expect(
      getById(block.container, "form-data-submited")
    ).not.toBeInTheDocument();
  });

  test("email field holds invalid data", async () => {
    listClone.name.shouldNotSubmit = "Ray";
    listClone.surname.shouldNotSubmit = "Kan";
    listClone.email.shouldNotSubmit = "asd@asd.c";
    listClone.country.shouldNotSubmit = "🇦🇫 Afghanistan";
    listClone.password.shouldNotSubmit = [...new Array(10)]
      .map(() => "a")
      .join("");

    const block = render(<FormRegisterFormatron environment="testing" />);
    await scenario(block);
    expect(
      getById(block.container, "form-data-submited")
    ).not.toBeInTheDocument();
  });

  test("country field holds invalid data", async () => {
    listClone.name.shouldNotSubmit = "Ray";
    listClone.surname.shouldNotSubmit = "Kan";
    listClone.email.shouldNotSubmit = "asd@asd.com";
    listClone.country.shouldNotSubmit = "KiMIn";
    listClone.password.shouldNotSubmit = [...new Array(10)]
      .map(() => "a")
      .join("");

    const block = render(<FormRegisterFormatron environment="testing" />);
    await scenario(block);
    expect(
      getById(block.container, "form-data-submited")
    ).not.toBeInTheDocument();
  });

  test("password field holds invalid data", async () => {
    listClone.name.shouldNotSubmit = "Ray";
    listClone.surname.shouldNotSubmit = "Kan";
    listClone.email.shouldNotSubmit = "asd@asd.c";
    listClone.country.shouldNotSubmit = "🇦🇫 Afghanistan";
    listClone.password.shouldNotSubmit = [...new Array(7)]
      .map(() => "a")
      .join("");

    const block = render(<FormRegisterFormatron environment="testing" />);
    await scenario(block);
    expect(
      getById(block.container, "form-data-submited")
    ).not.toBeInTheDocument();
  });
});
