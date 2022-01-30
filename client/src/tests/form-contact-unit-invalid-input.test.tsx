import { render, fireEvent, screen, getByText } from "@testing-library/react";
import React, { Component } from "react";
import { act } from "react-dom/test-utils";
import {
  FormRegisterFormatron,
  list,
} from "../components/form-register-formatron";
var listClone = JSON.parse(JSON.stringify(list));
jest.setTimeout(30000);

describe("checks there is an Error message for invalid input", () => {
  listClone.name.shouldFail = ["asad1", "123"];
  listClone.surname.shouldFail = ["asad1", "123"];
  listClone.email.shouldFail = [
    "abc",
    "12345",
    "def3ghj",
    "abc@def.c",
    "ghj@vbn.qwer",
    "@rty.com",
    "xcv@.com",
    "abc@def. ghj",
  ];
  listClone.password.shouldFail = [
    "ab1",
    "asdf asdf",
    [...new Array(15)].map(() => "a").join(""),
  ];

  for (const component of Object.keys(listClone)) {
    if ("shouldFail" in listClone[component])
      listClone[component]["shouldFail"].forEach((inputValue) => {
        test(`${component} for value: "${inputValue}" - should render Error under`, async () => {
          const block = render(<FormRegisterFormatron environment="testing" />);
          const fields = block.container.querySelectorAll(
            `[name='${component}']`
          );
          await act(async () => {
            fireEvent.change(fields[0], { target: { value: inputValue } });
          });
          await act(async () => {
            fireEvent.blur(fields[0]);
          });
          expect(
            fields[0].nextElementSibling &&
              fields[0].nextElementSibling.tagName.toLowerCase() === "div" &&
              fields[0].nextElementSibling.textContent ===
                listClone[component]["data-error-message"]
          ).toBeTruthy();
        });
      });
  }
});
