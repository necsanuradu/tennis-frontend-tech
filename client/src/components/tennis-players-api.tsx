import React, { useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { PlayersList } from "../web-helpers/tennisPlayersAtp";

const filterPlayersList = (
  playersList,
  nameFilter,
  rankSort,
  countryFilter
) => {
  let list = Object.entries(playersList)
    .filter(([key, val]: any) =>
      new RegExp(`${nameFilter}`, "i").test(val.full_name)
    )
    .filter(([key, val]: any) =>
      new RegExp(`${countryFilter}`, "i").test(val.country)
    );
  rankSort > 0
    ? list.sort((a: any, b: any) => a[0] - b[0])
    : list.sort((a: any, b: any) => b[0] - a[0]);

  return list.map(([key, val]: any) => {
    return (
      <div className="card mt-2" key={key}>
        <div className="card-body text-start px-3 py-2">
          <div className="col-6 d-inline">{val.full_name}</div>
          <div className="col-6 float-end text-end">{val.country}</div>
        </div>
        <div className="card-header">
          <div>{parseInt(key) + 1}</div>
        </div>
      </div>
    );
  });
};

const capitalizeString = (string) =>
  string[0].toUpperCase() + string.toLowerCase().slice(1);

const consoleLogFormData = (searchParams) => {
  const logView = {};
  ["name", "surname", "email", "country", "password"].forEach((key) =>
    searchParams.get(key) ? (logView[key] = searchParams.get(key)) : null
  );
  console.log(logView);
};
const addNewMemberToPlayersList = (PlayersList, searchParams) =>
  searchParams.get("name") &&
  searchParams.get("surname") &&
  searchParams.get("country")
    ? {
        ...PlayersList,
        ...{
          [Object.keys(PlayersList).length]: {
            full_name: `${capitalizeString(
              searchParams.get("name")
            )} ${capitalizeString(searchParams.get("surname"))}`,
            country: searchParams
              .get("country")
              .split(" ")
              .filter((val, index) => index > 0)
              .join(" "),
          },
        },
      }
    : PlayersList;

const TennisPlayersApi = (props) => {
  const initial: any = [];
  const [rawList, setRawList] = useState({});
  const [playersList, setPlayersList] = useState(initial);
  const [nameFilter, setNameFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [rankSort, setRankSort] = useState(-1);
  const [totalNumber, setTotalNumber] = useState(1);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (Object.keys(rawList).length === 0) {
      consoleLogFormData(searchParams);
      const newMemberPlayersList = addNewMemberToPlayersList(
        PlayersList,
        searchParams
      );
      const list = filterPlayersList(
        newMemberPlayersList,
        nameFilter,
        rankSort,
        countryFilter
      );

      setRawList(newMemberPlayersList);
      listLength(list);
    }
  }, [countryFilter, nameFilter, rankSort, rawList, playersList, searchParams]);

  const listLength = (list) => [
    setTotalNumber(list.length),
    setPlayersList(list),
  ];

  const renderListSort = () => {
    let sortBy = rankSort * -1;
    setRankSort(sortBy);
    const list = filterPlayersList(rawList, nameFilter, sortBy, countryFilter);
    listLength(list);
  };
  const renderListFilterName = (e) => {
    let filterBy = e.target.value;
    setNameFilter(filterBy);
    const list = filterPlayersList(rawList, filterBy, rankSort, countryFilter);
    listLength(list);
  };
  const renderListFilterCountry = (e) => {
    let filterBy = e.target.value;
    setCountryFilter(filterBy);
    const list = filterPlayersList(rawList, nameFilter, rankSort, filterBy);
    listLength(list);
  };

  const renderListDefault = (e) => {
    setRankSort(1);
    setNameFilter("");
    setCountryFilter("");
    const list = filterPlayersList(rawList, "", 1, "");
    listLength(list);
  };

  return (
    <div>
      <h2 className="text-start">GNT</h2>
      <h5 className="text-start mb-0 mt-0">
        List {totalNumber} player{totalNumber === 1 ? "" : "s"}
      </h5>
      <div className="col-1">
        <NavLink className="nav-link ps-0" to="/">
          Back
        </NavLink>
      </div>

      <div className="container text-start">
        <div
          className={`col-12 col-md-auto m-0 ${
            nameFilter || countryFilter || rankSort < 0
              ? " visible"
              : " invisible"
          }`}
        >
          <button
            className="btn btn-outline-success btn-outline btn-md col-12 col-md-auto d-inline m-0"
            onClick={renderListDefault}
          >
            Clear filters ×
          </button>
        </div>
      </div>

      <div className="container mt-2 sticky">
        <div className="row input-group mx-0  btn-focus rounded-1">
          <input
            type="text"
            className="form-control ps-3 pe-1 col-4"
            placeholder={"Filter name " + String.fromCharCode(8964)}
            value={nameFilter}
            onChange={renderListFilterName}
          />
          <button
            className="btn btn-light btn-outline btn-block btn-md col-4 d-inline text-muted"
            onClick={renderListSort}
          >
            <div className="d-inline">Ranking</div>{" "}
            <div className="d-inline-block col-1">
              {String.fromCharCode(8964 - (rankSort + 1) / 2)}
            </div>
          </button>
          <input
            type="text"
            className="form-control my-0 ps-1 pe-3 text-end col-4"
            placeholder={"Country " + String.fromCharCode(8964)}
            value={countryFilter}
            onChange={renderListFilterCountry}
          />
        </div>
      </div>
      <div id="players-list" className="container mt-3 players-list mb-5">
        {playersList}
      </div>
    </div>
  );
};

export { TennisPlayersApi };
