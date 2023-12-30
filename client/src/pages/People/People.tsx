import { useGetUsersQuery } from "../../services/api";
import { useParams } from "react-router-dom";
import { useEffect, useLayoutEffect } from "react";
import { Loader } from "../../components/Loader/Loader";
import { Paginate } from "../../components/Paginate/Paginate";
import { useAuth } from "../../hooks/useAuth";
import { UserFeed } from "./UserFeed/UserFeed";

export const People = () => {
  const params = useParams();
  const page = Number(params.page) || 1;
  const { user } = useAuth();
  const { data, error, isLoading, refetch } = useGetUsersQuery(page.toString());

  useLayoutEffect(() => {
    document.title = "Все профили | Profiler";
  }, []);
  useEffect(() => {
    refetch();
  }, [user]);

  if (isLoading) return <Loader />;
  if (error) return <div>Произошла ошибка при получении данных!</div>;
  if (!data || !data.users.length)
    return <div>Ни одного профиля не опубликовано.</div>;
  return (
    <>
      <UserFeed users={data.users} />
      <Paginate
        onPageFrom={page * 20 - 19}
        onPageToMax={page * 20}
        total={data.total}
        currentPage={page}
      />
    </>
  );
};
