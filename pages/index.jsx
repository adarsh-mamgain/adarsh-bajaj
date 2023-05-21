import { useState, useEffect } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [developers, setDevelopers] = useState([]);
  const [filteredDevelopers, setFilteredDevelopers] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [isSkillsDropdownOpen, setIsSkillsDropdownOpen] = useState(false);

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
    const filter = event.target.value.trim().toUpperCase();
    const filtered = developers.filter((developer) => {
      const developerName = developer.name ? developer.name.toUpperCase() : "";
      const developerSkills = developer.skills || [];

      if (filter === "" && selectedSkills.length === 0) {
        return true; // No name or skills filter, show all developers
      } else if (filter === "" && selectedSkills.length > 0) {
        return selectedSkills.some((skill) => developerSkills.includes(skill));
      } else if (filter !== "" && selectedSkills.length === 0) {
        return developerName.includes(filter);
      } else {
        return (
          developerName.includes(filter) &&
          selectedSkills.some((skill) => developerSkills.includes(skill))
        );
      }
    });

    setFilteredDevelopers(filtered);
  };

  const clearSkillsSelection = () => {
    setSelectedSkills([]);
    setFilteredDevelopers(developers);
  };

  const toggleSkillSelection = (skill) => {
    const updatedSkills = [...selectedSkills];
    if (updatedSkills.includes(skill)) {
      const skillIndex = updatedSkills.indexOf(skill);
      updatedSkills.splice(skillIndex, 1);
    } else {
      updatedSkills.push(skill);
    }
    setSelectedSkills(updatedSkills);

    const filtered = developers.filter((developer) => {
      if (updatedSkills.length === 0) {
        return true; // No skills selected, show all developers
      } else {
        const developerSkills = developer.skills || [];
        return updatedSkills.some((skill) => developerSkills.includes(skill));
      }
    });

    setFilteredDevelopers(filtered);
  };

  const filterByDesignation = (event) => {
    const filter = event.target.value.toUpperCase();
    if (filter === "") {
      setFilteredDevelopers(developers);
    } else {
      const filtered = developers.filter(
        (developer) =>
          developer &&
          developer.designation &&
          String(developer.designation).toUpperCase().includes(filter)
      );
      setFilteredDevelopers(filtered);
    }
  };

  const [selectedProject, setSelectedProject] = useState(null);

  const openPopup = (e, project) => {
    e.preventDefault();
    setSelectedProject(project);
    e.stopPropagation();
  };

  const closePopup = () => {
    setSelectedProject(null);
  };

  return (
    <main className="flex flex-col items-center justify-between p-4 md:p-24 bg-gradient-to-b from-gray-800 to-gray-900 text-white min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8">
        Bajaj Health Frontend Challenge
      </h1>
      <div className="search-bar flex flex-col md:flex-row items-center mb-4 md:mb-8">
        <label htmlFor="name" className="mr-2 mb-2 md:mb-0">
          Search by Name:
        </label>
        <input
          type="text"
          id="name"
          onChange={filterByName}
          placeholder="Enter name"
          className="p-2 bg-gray-700 text-white rounded-md mb-2 md:mb-0 md:mr-4"
        />
        <label htmlFor="skills" className="mr-2 mb-2 md:mb-0">
          Filter by Skills:
        </label>
        <div className="relative w-min-20">
          <div
            className="p-2 bg-gray-700 text-white rounded-md mb-2 md:mb-0 md:mr-4 cursor-pointer"
            onClick={() => setIsSkillsDropdownOpen(!isSkillsDropdownOpen)}
          >
            {selectedSkills.length > 0
              ? `${selectedSkills.join(", ")}`
              : "All"}
          </div>
          {isSkillsDropdownOpen && (
            <div className="absolute z-10 bg-white text-gray-800 rounded shadow-md mt-2">
              <div className="flex flex-col p-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={selectedSkills.length === 0}
                    onChange={clearSkillsSelection}
                  />
                  <span className="ml-2 font-bold">Clear</span>
                </label>
                {[
                  "JavaScript",
                  "Python",
                  "Java",
                  "HTML",
                  "CSS",
                  "Photoshop",
                  "Manual Testing",
                  "SQL",
                ].map((skill) => (
                  <label
                    key={skill}
                    className="inline-flex items-center"
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={selectedSkills.includes(skill)}
                      onChange={() => toggleSkillSelection(skill)}
                    />
                    <span className="ml-2">{skill}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <label htmlFor="designation" className="mr-2 mb-2 md:mb-0">
          Filter by Designation:
        </label>
        <select
          id="designation"
          onChange={filterByDesignation}
          className="p-2 bg-gray-700 text-white rounded-md mb-2 md:mb-0"
        >
          <option value="">All</option>
          <option value="Developer">Developer</option>
          <option value="QA Engineer">QA Engineer</option>
          <option value="Project Manager">Project Manager</option>
        </select>
      </div>
      <div className="overflow-x-auto max-w-full">
        <table className="min-w-full">
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
      </div>
      <footer className="text-gray-500 mt-4 md:mt-8">
        &copy; Adarsh Mamgain - 2023
      </footer>

      {/* The popup */}
      {selectedProject && (
        <div className="popup fixed inset-0 flex items-center justify-center bg-gray-400 bg-opacity-50">
          <div className="w-full max-w-lg bg-gray-700 p-4 rounded shadow">
            <div className="mb-4">
              <h2 className="text-xl md:text-2xl mb-2">
                {selectedProject.name}
              </h2>
              <p>{selectedProject.description}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg md:text-xl mb-2">Team:</h3>
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
            <div className="mb-4">
              <h3 className="text-lg md:text-xl mb-2">Tasks:</h3>
              <ul>
                {selectedProject.tasks.map((task, index) => (
                  <li key={index}>
                    {task.name} - {task.status}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-2">
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
