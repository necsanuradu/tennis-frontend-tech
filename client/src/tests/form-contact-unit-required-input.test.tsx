import { render, fireEvent, screen, getByText } from "@testing-library/react";
import React, { Component } from "react";
import { act } from "react-dom/test-utils";
import {
  FormRegisterFormatron,
  list,
} from "../components/form-register-formatron";
var listClone = JSON.parse(JSON.stringify(list));
jest.setTimeout(30000);

describe("checks there is an Error message required not present input", () => {
  listClone.name.shouldFail = [""];
  listClone.surname.shouldFail = [""];
  listClone.email.shouldFail = [""];
  listClone.country.shouldFail = [""];
  listClone.password.shouldFail = [""];

  for (const component of Object.keys(listClone)) {
    if ("shouldFail" in listClone[component]) {
      test(`${component} for no value - should render Error under`, async () => {
        const block = render(<FormRegisterFormatron environment="testing" />);
        await act(async () => {
          const submitButton = screen.getByRole("button", {
            name: /register/i,
          });
          fireEvent.click(submitButton);
        });
        const fields = block.container.querySelectorAll(
          `[name='${component}'].required`
        );
        await act(async () => {
          const submitButton = screen.getByRole("button", {
            name: /register/i,
          });
          fireEvent.click(submitButton);
        });

        expect(
          fields[0].nextElementSibling &&
            fields[0].nextElementSibling.tagName.toLowerCase() === "div"
        ).toBeTruthy();
      });
    }
  }
});
