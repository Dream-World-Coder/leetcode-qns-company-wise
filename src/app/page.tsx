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

const mockData: LeetCodeProblem[] = [
  {
    difficulty: "Easy",
    title: "Two Sum",
    frequency: 95.0,
    link: "https://leetcode.com/problems/two-sum/",
    topics: ["Array", "Hash Table", "Sorting", "Two Pointers", "Binary Search"],
  },
  {
    difficulty: "Medium",
    title: "Add Two Numbers",
    frequency: 87.6,
    link: "https://leetcode.com/problems/add-two-numbers/",
    topics: ["Linked List", "Math", "Recursion"],
  },
  {
    difficulty: "Hard",
    title: "Median of Two Sorted Arrays",
    frequency: 78.4,
    link: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
    topics: ["Array", "Binary Search", "Divide and Conquer"],
  },
  {
    difficulty: "Medium",
    title: "Longest Substring Without Repeating Characters",
    frequency: 92.0,
    link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    topics: ["Hash Table", "String", "Sliding Window"],
  },
  {
    difficulty: "Easy",
    title: "Palindrome Number",
    frequency: 65.0,
    link: "https://leetcode.com/problems/palindrome-number/",
    topics: ["Math"],
  },
];

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
  const [companies, setCompanies] = useState<string[]>([
    "Google",
    "Microsoft",
    "Amazon",
    "Apple",
    "Adobe",
    "Atlassian",
    "Accenture",
    "LinkedIn",
    "Media.net",
    "Citadel",
    "Oracle",
    "Cisco",
    "Uber",
    "Zomato",
    "Flipkart",
    "Visa",
    "Netflix",
    "Meta",
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [problems, setProblems] = useState<LeetCodeProblem[]>(mockData);

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
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          transformHeader: (header: string) => header.trim(), // Remove whitespace from headers
          complete: (results) => {
            const data: LeetCodeProblem[] = results.data
              .map((row: any) => {
                // Capitalize difficulty: "EASY" -> "Easy", "MEDIUM" -> "Medium", "HARD" -> "Hard"
                const difficultyRaw = row["Difficulty"]?.trim().toUpperCase();
                let difficulty: "Easy" | "Medium" | "Hard" | undefined;

                if (difficultyRaw === "EASY") difficulty = "Easy";
                else if (difficultyRaw === "MEDIUM") difficulty = "Medium";
                else if (difficultyRaw === "HARD") difficulty = "Hard";

                const title = row["Title"]?.trim();
                const frequency = parseFloat(row["Frequency"]);
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
          error: (error) => {
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
      searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1).toLowerCase();

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

        {/* Main Content */}
        <main className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-8 mb-6 justify-between">
            <div className="flex-1 w-full max-w-md flex justify-center items-center gap-2 relative">
              <input
                type="text"
                placeholder="Search any company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-full bg-white dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
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
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              {!isLoading && !error && (
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
                            Visit <ExternalLink className="size-4" />
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
              )}

              {isLoading && <div className="text-center py-8">Loading...</div>}

              {error && (
                <div className="text-red-600 dark:text-red-400 text-center py-4">
                  {error}
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
                {filteredData.length} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
          </div>
        </main>

        {/* Footer */}
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
