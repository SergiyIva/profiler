export type FilterInfoProps = {
  onPageFrom: number;
  onPageToMax: number;
  total: number;
};
export const FilterInfo = ({
  onPageFrom,
  onPageToMax,
  total,
}: FilterInfoProps) => {
  return (
    <div className="paginate__filter">
      Показано с {onPageFrom} по {onPageToMax < total ? onPageToMax : total} из{" "}
      {total} профилей
    </div>
  );
};
