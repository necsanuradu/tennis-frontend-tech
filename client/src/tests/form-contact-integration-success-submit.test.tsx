import {
  render,
  fireEvent,
  screen,
  queryByAttribute,
  waitFor,
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
      if ("shouldSubmit" in listClone[component]) {
        const field = block.container.querySelectorAll(`[name='${component}']`);
        fireEvent.change(field[0], {
          target: { value: listClone[component].shouldSubmit },
        });
      }
    }
  });
};

describe("checks submit is successful", () => {
  const getById = queryByAttribute.bind(null, "id");
  test("name, surname, email, country and password hold valid data", async () => {
    listClone.name.shouldSubmit = "Ray";
    listClone.surname.shouldSubmit = "Kan";
    listClone.email.shouldSubmit = "asd@asd.com";
    listClone.country.shouldSubmit = "🇦🇫 Afghanistan";
    listClone.password.shouldSubmit = [...new Array(10)]
      .map(() => "a")
      .join("");

    const block = render(<FormRegisterFormatron environment="testing" />);
    await act(async () => {
      await new Promise((r) => setTimeout(r, 3000));
    });
    await scenario(block);
    await act(async () => {
      const submitButton = screen.getByRole("button", {
        name: /register/i,
      });
      fireEvent.click(submitButton);
    });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 1000));
    });

    expect(getById(block.container, "form-data-submited")).toBeInTheDocument();
  });
});
