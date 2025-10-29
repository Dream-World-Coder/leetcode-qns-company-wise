"use client";

import { useState } from "react";
import {
  Moon,
  Sun,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  Search,
  Regex,
} from "lucide-react";
import Papa from "papaparse";

interface LeetCodeProblem {
  difficulty: "Easy" | "Medium" | "Hard";
  title: string;
  frequency: number;
  link: string;
  topics: string[];
  id?: string;
}

interface ResponseData {
  Difficulty?: "EASY" | "MEDIUM" | "HARD";
  Title?: string;
  Frequency?: string | number;
  Link?: string;
  Topics?: string;
}

const CustomSVG: React.FC = () => {
  return (
    <svg
      width="200"
      height="240"
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="rounded-sm invert-100 dark:invert-0"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0">
        <rect
          x="-40"
          y="-40"
          width="480"
          height="480"
          rx="0"
          fill="transparent"
          strokeWidth="0"
        />
      </g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path
          d="M87 354.009C95.9827 332.493 116.732 298.757 154.015 283.273C166.397 278.131 180.602 275.002 196.805 275.002C212.206 275.002 226.185 277.972 238.683 282.846C283.164 300.193 308.896 341.657 313.275 359.171"
          stroke="#ffffff"
          strokeOpacity="0.9"
          strokeWidth="20"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          opacity="0.503384"
          d="M205.288 62.9543C212.202 59.9093 208.776 61.4746 220.29 55.7274C226.629 52.563 234.549 48.8226 241.858 50.9087C251.804 53.7482 266.926 72.7469 254.986 81.7461C228.359 101.813 185.068 91.3966 166.842 125.111C163.694 130.934 162.288 138.388 164.967 144.866C172.583 163.283 217.291 160.4 232.481 158.839C234.94 158.587 247.739 158.611 247.483 152.575C246.45 128.127 194.535 94.5506 178.095 78.3734C176.761 77.0613 159.497 60.9096 165.904 54.7636C168.747 52.0366 182.173 56.9112 182.783 57.1726C203.846 66.1919 260.489 99.5431 246.546 129.448C230.982 162.828 150.424 148.643 155.121 194.977C157.125 214.746 188.514 220.988 202.474 224.851C227.763 231.848 279.673 249.057 287.336 208.469C292.635 180.4 279.69 128.835 245.139 127.52C211.51 126.24 181.84 165.962 139.649 154.984C99.8754 144.636 95.9881 83.8881 116.207 57.1726C140.198 25.4722 173.505 47.8995 201.537 61.0276C220.933 70.111 245.902 80.7106 244.671 107.283C243.257 137.793 227.583 163.029 210.445 186.786C201.427 199.286 184.53 215.921 183.252 232.56C181.706 252.681 210.71 251.665 222.635 248.942C236.145 245.857 251.104 236.693 261.08 227.26C281.515 207.939 300.416 174.584 295.775 144.866C290.129 108.713 235.577 74.4102 203.881 76.4459C191.807 77.2213 186.878 83.1631 181.376 93.3102C168.488 117.084 163.858 144.429 163.56 171.367C163.395 186.262 169.519 202.137 168.249 216.178C167.232 227.403 159.286 230.252 149.964 225.332C114.863 206.809 130.326 131.813 136.367 101.501C137.876 93.9325 137.169 82.1456 144.337 79.8187C152.011 77.3283 165.805 103.215 165.904 103.428C179.128 131.773 176.716 212.773 128.865 202.686C91.937 194.901 123.901 76.3487 167.311 83.6736C206.507 90.2866 233.069 130.476 235.294 168.958C235.779 177.342 234.284 197.049 227.792 205.095C219.216 215.724 186.66 217.283 178.095 206.059C173.823 200.463 170.385 193.79 169.186 186.786C164.308 158.273 190.612 79.293 217.946 66.3271C254.676 48.906 276.061 100.143 273.739 128.484C268.668 190.369 182.871 210.355 142.931 169.921C125.004 151.773 122.711 102.421 131.209 79.3371C135.751 67.0031 144.472 61.0207 156.058 56.6904C163.851 53.7785 185.334 49.3172 194.504 51.3909C233.016 60.0976 278.029 102.425 292.962 140.048C321.911 212.986 180.247 267.472 144.807 208.469C136.431 194.525 136.786 171.518 136.367 156.43C136.182 149.784 134.314 129.209 140.118 121.256C151.749 105.319 190.212 141.009 198.255 145.83C204.837 149.775 211.647 153.498 218.884 155.948C254.106 167.872 257.479 150.2 284.523 143.421C289.07 142.281 300.474 141.36 305.152 141.493C307.92 141.572 315.749 143.003 313.122 143.902C286.367 153.068 243.793 109.979 220.29 102.465C213.2 100.198 205.677 99.3493 198.255 99.092C184.171 98.6042 172.93 101.722 160.278 107.765C138.552 118.143 132.925 137.196 108.705 128.484"
          stroke="#ffffff"
          strokeOpacity="0.9"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default function Home() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDifficulties, setSelectedDifficulties] = useState<Set<string>>(
    new Set(["Easy", "Medium", "Hard"]),
  );
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [expandedTopics, setExpandedTopics] = useState<Set<string | undefined>>(
    new Set(),
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [problems, setProblems] = useState<LeetCodeProblem[]>([]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 25;

  const fetchCompanyData = async (
    companyName: string,
  ): Promise<LeetCodeProblem[]> => {
    setIsLoading(true);
    setError("");

    try {
      const csvUrl = `https://raw.githubusercontent.com/liquidslr/leetcode-company-wise-problems/main/${companyName}/5.%20All.csv`;
      // console.log(csvUrl); OK

      const response = await fetch(csvUrl);
      if (!response.ok) {
        throw new Error(`Company "${companyName}" not found`);
      }

      const csvText = await response.text();
      // console.log(csvText); OK

      return new Promise((resolve, reject) => {
        Papa.parse<ResponseData>(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          transformHeader: (header: string) => header.trim(),
          complete: (results) => {
            const data: LeetCodeProblem[] = results.data
              .map((row) => {
                // Capitalize difficulty: "EASY" -> "Easy", "MEDIUM" -> "Medium", "HARD" -> "Hard"
                const difficultyRaw = row["Difficulty"]?.trim().toUpperCase();
                let difficulty: "Easy" | "Medium" | "Hard" | undefined;

                if (difficultyRaw === "EASY") difficulty = "Easy";
                else if (difficultyRaw === "MEDIUM") difficulty = "Medium";
                else if (difficultyRaw === "HARD") difficulty = "Hard";

                const title = row["Title"]?.trim();

                const f = row["Frequency"] || "0";
                const frequency = parseFloat(
                  typeof f === "string" ? f : f?.toString(),
                );
                const link = row["Link"]?.trim();
                const topicsStr = row["Topics"]?.trim();

                // Parse topics - could be comma-separated string
                let topics: string[] = [];
                if (topicsStr) {
                  topics = topicsStr
                    .split(",")
                    .map((t: string) => t.trim())
                    .filter(Boolean);
                }

                return {
                  difficulty: difficulty!,
                  title: title || "",
                  frequency: isNaN(frequency) ? 0 : frequency,
                  link: link || "",
                  topics: topics,
                  id: link, // link = unique ID
                };
              })
              .filter((item) => item.title && item.link); // Filter out invalid rows

            resolve(data);
          },
          error: (error: Error) => {
            reject(error);
          },
        });
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a company name");
      return;
    }

    // capitalize
    const formattedQuery =
      searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1); //.toLowerCase();

    const data = await fetchCompanyData(formattedQuery);
    // console.log(data); OK

    if (data.length > 0) {
      setProblems(data);
      setCurrentPage(1); // Reset to first page
    }
  };

  const toggleComplete = (id: string): void => {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompletedTasks(newCompleted);
  };

  const toggleDifficulty = (difficulty: string): void => {
    const newSelected = new Set(selectedDifficulties);
    if (newSelected.has(difficulty)) {
      newSelected.delete(difficulty);
    } else {
      newSelected.add(difficulty);
    }
    setSelectedDifficulties(newSelected);
  };

  const toggleTopics = (id: string | undefined): void => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedTopics(newExpanded);
  };

  const filteredData = problems.filter((item) => {
    return selectedDifficulties.has(item.difficulty);
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const getDifficultyStyles = (difficulty: string): string => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700";
      case "Medium":
        return "bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700";
      case "Hard":
        return "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700";
      default:
        return "";
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
        {/* Header */}
        <header className="border-b border-neutral-200 dark:border-neutral-800 mb-6 w-full max-w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="w-full max-w-[1536px] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Leetcode Questions Company Wise
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                List of questions previously asked in different company OA and
                interviews, credit:{" "}
                <a
                  href="https://github.com/liquidslr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  liquidslr
                </a>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              {/*<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Log in
            </button>*/}
            </div>
          </div>
        </header>

        <main className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search & filters */}
          <div className="flex flex-col md:flex-row gap-8 mb-6 justify-between">
            <div className="flex-1 w-full max-w-[500px] flex justify-center items-center gap-2 relative">
              <input
                type="text"
                placeholder="Search companies, check the spelling and case sensitivity."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-full bg-white dark:bg-neutral-950
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
              {/* submit btn */}
              <Search
                size={34}
                strokeWidth={1}
                className="text-neutral-400 dark:text-neutral-600 cursor-pointer"
                onClick={handleSearch}
              />
            </div>

            <div className="flex gap-2 items-center">
              {["Easy", "Medium", "Hard"].map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => toggleDifficulty(difficulty)}
                  className={`px-3 py-1 rounded-full h-fit border text-sm font-medium transition-colors
                    flex justify-center items-center gap-1
                    bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white
                    border-neutral-200 dark:border-neutral-800`}
                >
                  {difficulty}

                  <X
                    size={16}
                    className={`text-xs font-thin
                      ${selectedDifficulties.has(difficulty) ? "" : "hidden"}
                    `}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div
            className={`${problems.length > 0 && "border"} border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden`}
          >
            {!isLoading && !error && problems.length > 0 && (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                      <tr>
                        <th className="w-0"></th>
                        <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                          Difficulty
                        </th>
                        <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-0 sm:px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                          Frequency
                        </th>
                        <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                          Link
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider hidden sm:table-cell">
                          Topics
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                      {paginatedData.map((item) => (
                        <tr
                          key={item.link}
                          className="group hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                        >
                          <td className="w-12 px-4 py-4 absolute translate-x-[-45px]">
                            <input
                              type="checkbox"
                              checked={completedTasks.has(item.link)}
                              onChange={() => toggleComplete(item.link)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="px-1 sm:px-4 py-4">
                            <span
                              className={`inline-flex px-2.5 py-0.5 rounded-md text-xs font-medium border ${getDifficultyStyles(item.difficulty)}`}
                            >
                              {item.difficulty}
                            </span>
                          </td>
                          <td className="px-2 sm:px-4 py-4 max-w-[336px]">
                            <span
                              className={
                                completedTasks.has(item.link)
                                  ? "line-through text-neutral-500"
                                  : ""
                              }
                            >
                              {item.title}
                            </span>
                          </td>
                          <td className="px-0 sm:px-4 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-neutral-200 dark:bg-neutral-800 rounded-full h-2 hidden sm:block">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${item.frequency}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                {item.frequency}%
                              </span>
                            </div>
                          </td>
                          <td className="px-1 sm:px-4 py-4">
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              Solve <ExternalLink className="size-4" />
                            </a>
                          </td>
                          <td className="px-4 py-4 hidden sm:table-cell max-w-[216px]">
                            <div className="relative">
                              <div className="flex flex-wrap gap-1">
                                {item.topics
                                  .slice(
                                    0,
                                    expandedTopics.has(item.id)
                                      ? item.topics.length
                                      : 3,
                                  )
                                  .map((topic, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                                    >
                                      {topic}
                                    </span>
                                  ))}
                                {item.topics.length > 3 && (
                                  <button
                                    onClick={() => toggleTopics(item.id)}
                                    className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                                  >
                                    {expandedTopics.has(item.id) ? (
                                      <>
                                        Less{" "}
                                        <ChevronUp className="w-3 h-3 ml-1" />
                                      </>
                                    ) : (
                                      <>
                                        +{item.topics.length - 3}{" "}
                                        <ChevronDown className="w-3 h-3 ml-1" />
                                      </>
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, filteredData.length)}{" "}
                    of {filteredData.length} results
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}

            {!isLoading && !error && problems.length === 0 && (
              <div className="grid place-items-center py-16">
                <CustomSVG />
              </div>
            )}
            {isLoading && <div className="text-center py-8">Loading...</div>}

            {error && (
              <div className="text-red-600 dark:text-red-400 text-center py-4">
                {error}
              </div>
            )}
          </div>
        </main>

        <footer
          className="w-full mt-24 px-4 sm:px-6 lg:px-8 py-3 text-center text-sm space-y-1
          border-t border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400"
        >
          <p>
            Full data storing credit to{" "}
            <a
              href="https://github.com/liquidslr/leetcode-company-wise-problems"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              liquidslr&apos;s repository
            </a>
          </p>
          <p>
            Contact:{" "}
            <a
              href="https://www.myopencanvas.in"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              My Personal Site
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
