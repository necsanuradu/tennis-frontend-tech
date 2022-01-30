import React from "react";

const ConsentMessage = () => (
  <div className="consentForm mt-3 mb-0 col-12">
    Submitting your details indicates your consent for us to process your
    personal data as explained in our privacy notice{" "}
    <a href="/data-consent"> here</a>. Please read this important notice, which
    contains details on how to exercise your privacy rights.
  </div>
);
export default ConsentMessage;

/* <NavLink className="nav-link d-inline ps-1 pe-0" to="/data-consent">
here
</NavLink> */
