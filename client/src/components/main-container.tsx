import React from "react";
import DataConsent from "./data-consent";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { FormRegisterFormatron } from "./form-register-formatron";
import { Logo } from "./logo";
import { TennisPlayersApi } from "./tennis-players-api";
import { ScrollTop } from "./scroll-top";

type CardProps = {
  title?: string;
};

export const MainContainer = ({ title }: CardProps) => (
  <div className="container px-3 py-3" id="top">
    <Logo />
    <Router>
      <Routes>
        <Route
          path="/"
          element={<FormRegisterFormatron environment="testing" />}
        />
      </Routes>
      <Routes>
        <Route path="/data-consent" element={<DataConsent />} />
      </Routes>
      <Routes>
        <Route path="/members" element={<TennisPlayersApi />} />
      </Routes>
    </Router>
    <ScrollTop />
  </div>
);
