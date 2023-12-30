import { FilterInfo } from "./FilterInfo/FilterInfo";
import { Pagination } from "./Pagination/Pagination";

type FooterProps = {
  total: number;
  onPageFrom: number;
  onPageToMax: number;
  currentPage: number;
};
export const Paginate = ({
  total,
  onPageFrom,
  onPageToMax,
  currentPage,
}: FooterProps) => {
  return (
    <div className="paginate__wrapper">
      <FilterInfo
        onPageFrom={onPageFrom}
        onPageToMax={onPageToMax}
        total={total}
      />
      <Pagination
        total={total}
        onPageToMax={onPageToMax}
        onPageFrom={onPageFrom}
        currentPage={currentPage}
      />
    </div>
  );
};
