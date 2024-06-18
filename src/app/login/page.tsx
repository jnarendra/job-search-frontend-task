"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Eye, EyeSlash, Input } from "../component";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BACKEND_URL, notify } from "../utils";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    setValue,
    watch,
    getValues,
  } = useForm();
  const { push, replace } = useRouter();

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      replace("/");
    }
  }, [replace]);
  console.log(getValues(),"helloo")
  const onSubmit = async (data) => {
    try {
      const res = await axios.post(BACKEND_URL + "/login", null, {
        params: {
          email: data.email,
          password: data.password,
        },
      });
      if (res.data.access_token) {
        localStorage.setItem("accessToken", res.data.access_token);
        notify("Logged in successfully");
        push("/");
      }
    } catch (e) {
      console.log(e);
      setError("apiError", { message: e?.message });
    }
  };

  const email = watch("email", "");
  const password = watch("password", "");
  const passwordShow = watch("passwordShow", false);

  return (
    <div className="flex flex-col justify-center items-center h-full bg-[url('https://1.bp.blogspot.com/--UQ8_O1EFN8/XWkZdpW_MMI/AAAAAAAATDE/kcJXA9nMy4ElB4NmBZDM6WwPE4JQD7ACQCLcBGAs/s1600/shape.png')] bg-cover">
      <div className="bg-[#133f878a] px-[40px] rounded-[12px] shadow-md py-[40px] w-[400px]">
        <form
          className="flex flex-col gap-[16px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            label="Email"
            value={email}
            setValue={(value) => {
              clearErrors("email");
              setValue("email", value);
            }}
            placeholder="Enter your email"
            type="email"
            isClearable
            error={errors.email && errors.email.message}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-z0-9]+@[a-z0-9]+\.[a-z]{2,3}$/,
                message: "Invalid email",
              },
            })}
          />

          <Input
            label="Password"
            value={password}
            setValue={(value) => {
              clearErrors("password");
              setValue("password", value);
            }}
            placeholder="Enter your password"
            type={passwordShow ? "text" : "password"}
            error={errors.password && errors.password.message}
            icon={
              passwordShow ? (
                <Eye onClick={() => setValue("passwordShow", false)} />
              ) : (
                <EyeSlash onClick={() => setValue("passwordShow", true)} />
              )
            }
            {...register("password", {
              required: "Password is required",
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                message: "Invalid password",
              },
            })}
          />

          {errors.apiError && (
            <div className="text-red-400 mt-2">
              There was an error logging you in: {errors.apiError.message}
            </div>
          )}

          <div className="flex justify-center items-center mt-[20px]">
            <Button
              className="my-[20px] rounded-[10px] text-md font-medium w-[120px]"
              type="submit"
            >
              Log in
            </Button>
          </div>

          <div className="text-center mt-4 text-sm text-[#fff]">
            <div>Don&apos;t have an account?</div>
            <div className="text-[#000]"> 
              Click{" "}
              <Link href={`/signup`} className="text-white">
                here
              </Link>{" "}
              to signup.
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
