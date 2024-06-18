"use client";
import Image from "next/image";
import { Button, Input, Logout, Search } from "./component";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BACKEND_URL, notify } from "./utils";

export default function Home() {
  const [searchString, setSearchString] = useState("");
  const [data, setData] = useState([]);
  const { push, replace } = useRouter();

  const authToken = localStorage.getItem("accessToken");

  useEffect(() => {
    !authToken && push("/login");
  }, [authToken]);

  const onSearch = useCallback(async () => {
    const res = await axios.post(BACKEND_URL + "/job_search", null, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      params: {
        job_title: searchString,
      },
    });

    setData(res.data.data);
  }, [searchString]);

  return authToken ? (
    <main className="flex min-h-screen flex-col items-center px-[60px] py-[40px] relative bg-[#e5e7eb]">
      <div className="flex flex-row flex-wrap gap-2 w-[90%] relative">
        <Input
          placeholder="Search jobs..."
          setValue={(txt) => setSearchString(txt)}
          value={searchString}
        />
        <Button
          onClick={onSearch}
          className="h-10 absolute right-[10px] top-[50%] bg-transparent transform translate-x-[-50%] p-0 translate-y-[-50%]"
        >
          <Search />
        </Button>
      </div>
      {!!data.length ? (
        <div className="grid grid-cols-3 gap-[20px] my-[40px]">
          {data.map((row, index) => (
            <div
              key={index}
              className="bg-[#133f8773]  shadow-[3px_4px_5px_0px_#5c5d5ffa] p-[30px] rounded-[10px]"
            >
              <div className="flex  items-center gap-2 mb-[12px]">
                <h4 className="font-bold text-lg ">Job Name :</h4>
                <div>
                  <p className="text-lg ">{row?.job_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-lg   ">Company Name :</h4>
                <div>
                  <p>{row?.company_name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>Not Found</div>
      )}
      <button
        className="absolute top-[20px] right-10  px-[8px] py-[8px] rounded-md"
        onClick={() => {
          localStorage.removeItem("accessToken");
          replace("/login");
          notify("Logged Out");
        }}
      >
        <Logout />
      </button>
    </main>
  ) : null;
}
