import { useEffect, useState } from "react";
import "./App.css";
import Loading from "./component/loading";

interface Project {
  id: number;
  "percentage.funded": number;
  "amt.pledged": number;
}

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 5;

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json"
      );
      const response: Project[] = await res.json();
      setProjects(response);
    } catch (error) {
      console.log(">>> error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading) return <Loading />;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = projects.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Kickstarter Projects</h1>
      </header>

      <main>
        <table className="projects-table">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Percentage Funded</th>
              <th>Amount Pledged</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProjects.length > 0 ? (
              paginatedProjects.map((project, index) => (
                <tr key={project.id || `${index}-${project["amt.pledged"]}`}>
                  <td>{startIndex + index + 1}</td>
                  <td>{project["percentage.funded"]}%</td>
                  <td>${project["amt.pledged"]}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>No projects available</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="pagination">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
