import { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import SearchSection from "../home/SearchSection";
import "./JobList.css";


/* Job Type */
type Job = {
  id: number;
  title: string;
  company: string;
  state: string;
  location: string;
  salary?: string;
  tags: string[];
  description: string;
};

const JobList = () => {
  // get data from Home page
  const location = useLocation();

  /* Search text */
  const [searchText, setSearchText] = useState(location.state?.search || "");

  /* Selected state (location) */
  const [selectedState, setSelectedState] = useState(
    location.state?.selected || ""
  );

  /* Jobs from API */
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* Selected job for details view */
  const [activeJob, setActiveJob] = useState<Job | null>(null);

  
    //  API CALL USING AXIOS
 
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get("http://localhost:4000/jobs");

      setJobs(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load jobs");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
  fetchJobs();
}, []);

  
    //  FILTER JOBS
 
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const titleMatch =
        searchText === "" ||
        job.title.toLowerCase().includes(searchText.toLowerCase());

      const stateMatch = selectedState === "" || job.state === selectedState;

      return titleMatch && stateMatch;
    });
  }, [jobs, searchText, selectedState]);

 
    //  UI
  
  return (
    <div className="container-fluid job-page ">
      {/* Search Section */}
      <SearchSection
        search={searchText}
        setSearch={setSearchText}
        selected={selectedState}
        setSelected={setSelectedState}
        onSearch={() => {}}
      />

      <div className="row mt-3 jobs">
        {/* LEFT SIDE – Job List */}
        <div className="col-md-5 job-list">
          {loading && <p>Loading jobs...</p>}
          {error && <p className="text-danger">{error}</p>}

          {!loading && filteredJobs.length === 0 && <p>No jobs found</p>}

          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className={`job-card ${activeJob?.id === job.id ? "active" : ""}`}
              onClick={() => setActiveJob(job)}
            >
              <h6>{job.title}</h6>
              <p>{job.company}</p>
              <p>
                {job.location}, {job.state}
              </p>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE – Job Details */}
        <div className="col-md-7 job-details" >
          {activeJob ? (
            <>
              <h4>{activeJob.title}</h4>
              <p>{activeJob.company}</p>
              <p>
                {activeJob.location}, {activeJob.state}
              </p>
              <p>{activeJob.salary}</p>

              <button className="btn btn-primary">Apply Now</button>

              <hr />

              <p>{activeJob.description}</p>
            </>
          ) : (
            <p>Select a job to see details</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobList;
