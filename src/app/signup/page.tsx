"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, CheckMark, Eye, EyeSlash, Input, XMark } from "../component";
import axios from "axios";
import { BACKEND_URL, notify } from "../utils";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: { value: "", isError: false, isTouched: false },
    email: { value: "", isError: false, isTouched: false },
    password: { value: "", isError: false, isTouched: false, show: false },
  });
  const [error, setError] = useState("");
  const { push, replace } = useRouter();

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      replace("/");
    }
  }, []);

  const validate = useCallback(() => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    let valid = true;

    // Validate name
    if (!formData.name.value.trim()) {
      setFormData((prev) => ({
        ...prev,
        name: { ...prev.name, isError: true, isTouched: true },
      }));
      valid = false;
    }

    // Validate email
    if (!emailRegex.test(formData.email.value)) {
      setFormData((prev) => ({
        ...prev,
        email: { ...prev.email, isError: true, isTouched: true },
      }));
      valid = false;
    }

    // Validate password
    if (!passwordRegex.test(formData.password.value)) {
      setFormData((prev) => ({
        ...prev,
        password: { ...prev.password, isError: true, isTouched: true },
      }));
      valid = false;
    }

    return valid;
  }, [formData]);

  const onClick = useCallback(async () => {
    try {
      const res = await axios.post(BACKEND_URL + "/createUser", {
        email: formData.email.value,
        password: formData.password.value,
        full_name: formData.name.value,
      });
      if (res.data.message) {
        setError("");
        notify("Signed up successfully");
        push("/login");
      }
    } catch (e) {
      setError(e?.message || "Something went wrong.");
    }
  }, [formData]);

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], value, isError: false },
    }));
  }, []);

  const handleTogglePassword = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      password: { ...prev.password, show: !prev.password.show },
    }));
  }, []);

  const handleClick = useCallback(() => {
    if (validate()) {
      onClick();
    }
  }, [validate, onClick]);

  return (
    <div className="flex flex-col justify-center items-center h-full bg-[url('https://1.bp.blogspot.com/--UQ8_O1EFN8/XWkZdpW_MMI/AAAAAAAATDE/kcJXA9nMy4ElB4NmBZDM6WwPE4JQD7ACQCLcBGAs/s1600/shape.png')] bg-cover">
      <div className="bg-[#133f878a] px-[40px] rounded-[12px] shadow-md py-[40px] w-[400px]">
        <form className="flex flex-col gap-[16px]">
          <Input
            label="Name"
            value={formData.name.value}
            setValue={(value) => handleChange("name", value)}
            placeholder="Enter your name"
            type="text"
            isClearable
            error={
              formData.name.isError && formData.name.isTouched && "Invalid name"
            }
          />

          <Input
            label="Email"
            value={formData.email.value}
            setValue={(value) => handleChange("email", value)}
            placeholder="Enter your email"
            type="email"
            isClearable
            error={
              formData.email.isError &&
              formData.email.isTouched &&
              "Invalid email"
            }
          />

          <Input
            label="Password"
            value={formData.password.value}
            setValue={(value) => handleChange("password", value)}
            placeholder="Enter your password"
            type={formData.password.show ? "text" : "password"}
            icon={
              formData.password.show ? (
                <Eye onClick={handleTogglePassword} />
              ) : (
                <EyeSlash onClick={handleTogglePassword} />
              )
            }
            error={
              formData.password.isError &&
              formData.password.isTouched &&
              "Invalid password"
            }
          />

          {!!formData.password.value.length > 0 && (
            <div>
              <PasswordValidationItem
                isValid={
                  formData.password.value.length >= 8 &&
                  /\d/.test(formData.password.value) &&
                  /[a-z]/.test(formData.password.value) &&
                  /[A-Z]/.test(formData.password.value)
                }
                text="Password should be greater that 8 with 1 uppercase and one digit"
              />
            </div>
          )}
        </form>

        {error && (
          <div className="text-red-400 mt-2">
            There was an error signing you up: {error}
          </div>
        )}

        <div className="flex justify-center items-center">
          <Button className="my-[20px]  px-[20px] " onClick={handleClick}>
            Sign up
          </Button>
        </div>

        <div className="text-center mt-4 text-sm text-[#000]">
          <div>Already have an account?</div>
          <div>
            Click{" "}
            <Link href={`/login`} className="text-white">
              here
            </Link>{" "}
            to login.
          </div>
        </div>
      </div>
    </div>
  );
};

const PasswordValidationItem = ({ isValid, text }) => (
  <div
    className={`flex flex-row gap-1 items-center ${
      isValid ? "text-[#23eb23]" : "text-red-[#cd00]"
    }`}
  >
    {isValid ? <CheckMark /> : <XMark className="text-red-[#cd00] cursor-none" />}{" "}
    <div>{text}</div>
  </div>
);

export default SignUp;
