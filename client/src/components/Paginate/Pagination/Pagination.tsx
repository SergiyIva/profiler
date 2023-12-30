import { NavLink } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useMemo } from "react";
import { range } from "lodash";

export type PaginationProps = {
  total: number;
  onPageToMax: number;
  onPageFrom: number;
  currentPage: number;
};

export const Pagination = ({
  currentPage,
  onPageFrom,
  onPageToMax,
  total,
}: PaginationProps) => {
  const maxPage = useMemo(() => {
    return Math.ceil(total / (onPageToMax - onPageFrom + 1));
  }, [total, onPageFrom, onPageToMax]);

  const getStart = () => {
    if (currentPage - 2 < 2 || maxPage - 5 < 2) {
      return 2;
    } else {
      if (currentPage + 3 > maxPage) {
        return maxPage - 5;
      }
      return currentPage - 2;
    }
  };

  const getTo = (page: number) => `/people/${page}`;

  return (
    <div className={"flex-gap"}>
      <ul className="paginate__container">
        <li
          className={`paginate__button previous ${
            currentPage === 1 ? "disabled" : ""
          }`}
        >
          <NavLink
            to={getTo(currentPage - 1)}
            tabIndex={1}
            aria-label={"Предыдущая страница"}
          >
            <FaChevronLeft />
          </NavLink>
        </li>
        <li className={`paginate__button ${currentPage === 1 ? "active" : ""}`}>
          <NavLink to={getTo(1)} tabIndex={1} aria-label={"Первая страница"}>
            1
          </NavLink>
        </li>
        {maxPage !== 1 &&
          range(
            getStart(),
            Math.min(maxPage, currentPage + 3 < 7 ? 7 : currentPage + 4),
          ).map((i) =>
            (maxPage > 7 && currentPage + 3 < 7 && i === 6) ||
            (currentPage + 3 >= 7 && i === currentPage + 3) ? (
              <li className="paginate__button disabled" key={"..."}>
                <NavLink to={getTo(currentPage)} tabIndex={1}>
                  …
                </NavLink>
              </li>
            ) : (
              <li
                className={`paginate__button ${
                  currentPage === i ? "active" : ""
                }`}
                key={i}
              >
                <NavLink
                  to={getTo(i)}
                  tabIndex={1}
                  aria-label={`${i} страница`}
                >
                  {i}
                </NavLink>
              </li>
            ),
          )}
        {maxPage !== 1 && (
          <li
            className={`paginate__button ${
              currentPage === maxPage ? "active" : ""
            }`}
          >
            <NavLink
              to={getTo(maxPage)}
              tabIndex={1}
              aria-label={`${maxPage} страница`}
            >
              {maxPage}
            </NavLink>
          </li>
        )}
        <li
          className={`paginate__button next ${
            currentPage === maxPage ? "disabled" : ""
          }`}
        >
          <NavLink
            to={getTo(currentPage + 1)}
            tabIndex={1}
            aria-label={"Следующая страница"}
          >
            <FaChevronRight />
          </NavLink>
        </li>
      </ul>
    </div>
  );
};
