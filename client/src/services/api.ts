import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  ChangePasswordRequest,
  LoginRequest,
  OkResponse,
  RegisterRequest,
  UpdateUserRequest,
  User,
  UserFeed,
} from "./types";

const baseUrl = process.env.REACT_APP_BASE_API;
export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),
  tagTypes: ["User", "Users"],
  endpoints: (builder) => ({
    getUsers: builder.query<UserFeed, string>({
      query: (page) => `users/?page=${page}`,
      providesTags: ["Users"],
    }),
    getUser: builder.query<User, {}>({
      query: () => `users/me`,
      providesTags: ["User"],
    }),
    updateUser: builder.mutation<User, FormData>({
      query: (data) => ({
        url: "users/me",
        method: "POST",
        body: data,
      }),
    }),
    changePassword: builder.mutation<OkResponse, ChangePasswordRequest>({
      query: (credentiols) => ({
        url: "users/password",
        method: "POST",
        body: credentiols,
      }),
    }),
    login: builder.mutation<User, LoginRequest>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Users"],
    }),
    logout: builder.mutation<OkResponse, {}>({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Users", "User"],
    }),
    register: builder.mutation<User, FormData>({
      query: (data) => ({
        url: "auth/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useLazyGetUserQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUpdateUserMutation,
  useChangePasswordMutation,
} = api;
