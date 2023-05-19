import { useState, useEffect } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [developers, setDevelopers] = useState([]);
  const [filteredDevelopers, setFilteredDevelopers] = useState([]);

  useEffect(() => {
    fetch("/api/data")
      .then((response) => response.json())
      .then((data) => {
        setDevelopers(data.employees);
        setFilteredDevelopers(data.employees);
      })
      .catch((error) => console.error(error));
  }, []);

  const filterByName = (event) => {
    const filter = event.target.value.toUpperCase();
    const filtered = developers.filter((developer) =>
      developer.name.toUpperCase().includes(filter)
    );
    setFilteredDevelopers(filtered);
  };

  const filterByDesignation = (event) => {
    const filter = event.target.value.toUpperCase();
    const filtered = developers.filter(
      (developer) =>
        filter === "" || developer.designation.toUpperCase() === filter
    );
    setFilteredDevelopers(filtered);
  };

  const [selectedProject, setSelectedProject] = useState(null);

  const openPopup = (e, project) => {
    e.preventDefault();
    setSelectedProject(project);
    window.addEventListener("click", closePopup);
    e.stopPropagation();
  };

  const closePopup = () => {
    window.removeEventListener("click", closePopup);
    setSelectedProject(null);
  };

  return (
    <main className="flex flex-col items-center justify-between p-24 bg-gradient-to-b from-gray-800 to-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8">
        Bajaj Health Frontend Challenge
      </h1>
      <div className="search-bar flex items-center mb-8">
        <label htmlFor="name" className="mr-2">
          Search by Name:
        </label>
        <input
          type="text"
          id="name"
          onChange={filterByName}
          placeholder="Enter name"
          className="p-2 bg-gray-700 text-white rounded-md"
        />
        <label htmlFor="designation" className="ml-4 mr-2">
          Filter by Designation/Skills:
        </label>
        <select
          id="designation"
          onChange={filterByDesignation}
          className="p-2 bg-gray-700 text-white rounded-md"
        >
          <option value="">All</option>
          <option value="Developer">Developer</option>
          <option value="Designer">Designer</option>
          <option value="Tester">Tester</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Designation</th>
            <th className="py-2">Skills</th>
            <th className="py-2">Projects</th>
          </tr>
        </thead>
        <tbody>
          {filteredDevelopers.length > 0 ? (
            filteredDevelopers.map((developer, index) => (
              <tr key={index} className="bg-gray-700">
                <td className="px-6 py-2">
                  {developer.name ? developer.name : "--"}
                </td>
                <td className="px-6 py-2">
                  {developer.designation ? developer.designation : "--"}
                </td>
                <td className="px-6 py-2">
                  {developer.skills.join(", ")
                    ? developer.skills.join(", ")
                    : "--"}
                </td>
                <td className="px-6 py-2">
                  {developer.projects
                    ? developer.projects.map((project, index) => (
                        <a
                          key={index}
                          href="#"
                          onClick={(e) => openPopup(e, project)}
                          className="text-blue-500 hover:underline px-2"
                        >
                          {project.name}
                        </a>
                      ))
                    : "--"}
                </td>
              </tr>
            ))
          ) : (
            <tr className="bg-gray-700">
              <td colSpan="6" className="px-6 py-2">
                No developers found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <footer className="text-gray-500 mt-8">
        &copy; Adarsh Mamgain - 2023
      </footer>

      {/* The popup */}
      {selectedProject && (
        <div
          id="popup"
          className="w-[600px] h-[400px] popup fixed bg-gray-400 p-4 rounded shadow"
        >
          <div className="popup-content">
            <div className="mb-3">
              <h2 className="text-2xl mb-4">{selectedProject.name}</h2>
              <p>{selectedProject.description}</p>
            </div>
            <div className="mb-3">
              <h3 className="text-xl mb-2">Team:</h3>
              <ul>
                {selectedProject.team.map((member, index) => (
                  <li key={index}>
                    {member.name
                      ? `${member.name} - ${member.role}`
                      : member.role}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-3">
              <h3 className="text-xl mb-2">Tasks:</h3>
              <ul>
                {selectedProject.tasks.map((task, index) => (
                  <li key={index}>
                    {task.name} - {task.status}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-3">
              <button className="text-red-500" onClick={closePopup}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
