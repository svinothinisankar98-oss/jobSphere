
import { useState } from "react";
import "./Home.css";

import PopularJobs from "./PopularJobs";
import SearchSection from "./SearchSection";
import { useNavigate } from "react-router-dom";

function Home() {
  
const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");

  const onSearch = () => {
    navigate("/job-list", {
      state: { search, selected },
    });
  };
  
  

 return (
    <div className="container my-4 mt-0 mt-md-4">
      <SearchSection
        search={search}
        setSearch={setSearch}
        selected={selected}
        setSelected={setSelected}
        onSearch={onSearch}
      />

      {/*  Middle Section*/}

      <section className=" py-3 mt-3">
        <div className="container text-center">
          {/* Title */}
          <h2 className="fw-bold mt-2">Your Career Journey Starts Here</h2>

          {/* Subtitle */}
          <p className="text-muted mt-2 px-2 px-md-5">
            Discover jobs tailored to your skills, location, and career goals.
          </p>

          {/* CTA Button */}
          <div className="mt-4">
            <button className="btn btn-info btn-sm rounded-pill px-5">
              Get Started →
            </button>
          </div>
        </div>
      </section>

      {/* Popular Jobs */}

      <PopularJobs />
    </div>
  );
}

export default Home;
