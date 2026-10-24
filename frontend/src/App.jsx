import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Trophy,
  Medal,
  PlusCircle,
  Search,
  Flame,
  Crown,
  Zap,
  UserX,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function App() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [username, setUsername] = useState("");
  const [score, setScore] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [userRank, setUserRank] = useState(null);
  const [error, setError] = useState("");

  const fetchLeaderboard = async () => {
    try {
      const res = await axios.get(`${API_URL}/leaderboard`);
      setLeaderboard(res.data.leaderboard);
    } catch (err) {
      console.error("Leaderboard fetch error:", err);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleScoreSubmit = async (e) => {
    e.preventDefault();
    if (!username || !score) return;
    try {
      await axios.post(`${API_URL}/score`, { username, score: Number(score) });
      setUsername("");
      setScore("");
      fetchLeaderboard();
    } catch (err) {
      console.error("Score add error:", err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setUserRank(null);
    if (!searchUser) return;
    try {
      const res = await axios.get(`${API_URL}/rank/${searchUser}`);
      setUserRank(res.data);
    } catch (err) {
      setError("User not found on active leaderboard");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#09090b",
        color: "#f4f4f5",
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
        padding: "32px 16px",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Header */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: "24px",
            borderBottom: "1px solid #27272a",
            marginBottom: "32px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                backgroundColor: "#ff003c22",
                border: "1px solid #ff003c55",
                padding: "12px",
                borderRadius: "16px",
              }}
            >
              <Trophy
                style={{ width: "36px", height: "36px", color: "#ff003c" }}
              />
            </div>
            <div>
              <h1
                className="text-3xl font-extrabold tracking-wide"
                style={{
                  fontSize: "30px",
                  fontWeight: "900",
                  letterSpacing: "0.5px",
                  margin: 0,
                  color: "#ffffff",
                }}
              >
                GLOBAL REDIS LEADERBOARD
              </h1>
              <p
                style={{
                  color: "#a1a1aa",
                  fontSize: "14px",
                  marginTop: "4px",
                  margin: 0,
                }}
              >
                High-Performance In-Memory Sorted Set (ZSET) Ranking Engine
              </p>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#ff003c15",
              color: "#ff4d6d",
              border: "1px solid #ff003c44",
              padding: "8px 16px",
              borderRadius: "9999px",
              fontSize: "13px",
              fontWeight: "700",
            }}
          >
            <Flame
              style={{ width: "18px", height: "18px", color: "#ff003c" }}
            />{" "}
            Real-Time Engine Active
          </div>
        </header>

        {/* Grid Container */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "32px",
          }}
        >
          {/* Left Panel */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {/* Add / Boost Score Form */}
            <div
              style={{
                backgroundColor: "#121215",
                padding: "24px",
                borderRadius: "20px",
                border: "1px solid #27272a",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "800",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: "#ffffff",
                }}
              >
                <PlusCircle
                  style={{ width: "20px", height: "20px", color: "#ff003c" }}
                />{" "}
                Boost Player Score
              </h2>
              <form
                onSubmit={handleScoreSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: "700",
                      color: "#a1a1aa",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. Alex"
                    style={{
                      width: "100%",
                      marginTop: "6px",
                      backgroundColor: "#09090b",
                      border: "1px solid #27272a",
                      borderRadius: "10px",
                      padding: "12px",
                      color: "#ffffff",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: "700",
                      color: "#a1a1aa",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Points Increment
                  </label>
                  <input
                    type="number"
                    required
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    placeholder="e.g. 150"
                    style={{
                      width: "100%",
                      marginTop: "6px",
                      backgroundColor: "#09090b",
                      border: "1px solid #27272a",
                      borderRadius: "10px",
                      padding: "12px",
                      color: "#ffffff",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    backgroundColor: "#ff003c",
                    color: "#ffffff",
                    fontWeight: "800",
                    padding: "12px",
                    borderRadius: "10px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "14px",
                    marginTop: "8px",
                    transition: "background-color 0.2s",
                  }}
                >
                  ⚡ UPDATE REDIS SCORE
                </button>
              </form>
            </div>

            {/* Rank Lookup */}
            <div
              style={{
                backgroundColor: "#121215",
                padding: "24px",
                borderRadius: "20px",
                border: "1px solid #27272a",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "800",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: "#ffffff",
                }}
              >
                <Search
                  style={{ width: "20px", height: "20px", color: "#ff003c" }}
                />{" "}
                Player Rank Lookup
              </h2>
              <form
                onSubmit={handleSearch}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <input
                  type="text"
                  required
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  placeholder="Enter username..."
                  style={{
                    width: "100%",
                    backgroundColor: "#09090b",
                    border: "1px solid #27272a",
                    borderRadius: "10px",
                    padding: "12px",
                    color: "#ffffff",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    backgroundColor: "#18181b",
                    color: "#f4f4f5",
                    fontWeight: "700",
                    padding: "12px",
                    borderRadius: "10px",
                    border: "1px solid #3f3f46",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  SEARCH RANK
                </button>
              </form>

              {userRank && (
                <div
                  style={{
                    marginTop: "20px",
                    padding: "16px",
                    backgroundColor: "#18181b",
                    border: "1px solid #ff003c55",
                    borderRadius: "12px",
                  }}
                >
                  <p
                    style={{
                      fontWeight: "800",
                      color: "#ff4d6d",
                      margin: "0 0 8px 0",
                      fontSize: "16px",
                    }}
                  >
                    👤 {userRank.username}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "14px",
                      color: "#d4d4d8",
                    }}
                  >
                    <span>
                      Global Rank:{" "}
                      <strong style={{ color: "#ffd700" }}>
                        #{userRank.rank}
                      </strong>
                    </span>
                    <span>
                      Total Score:{" "}
                      <strong style={{ color: "#ffffff" }}>
                        {userRank.score} pts
                      </strong>
                    </span>
                  </div>
                </div>
              )}
              {error && (
                <p
                  style={{
                    marginTop: "16px",
                    fontSize: "13px",
                    color: "#ff4d6d",
                    margin: "16px 0 0 0",
                  }}
                >
                  {error}
                </p>
              )}
            </div>
          </div>

          {/* Right Panel: Leaderboard List */}
          <div
            style={{
              backgroundColor: "#121215",
              padding: "28px",
              borderRadius: "20px",
              border: "1px solid #27272a",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <h2
                style={{
                  fontSize: "22px",
                  fontWeight: "900",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: "#ffffff",
                  margin: 0,
                }}
              >
                <Medal
                  style={{ width: "26px", height: "26px", color: "#ff003c" }}
                />{" "}
                TOP RANKERS
              </h2>
              <span
                style={{
                  fontSize: "12px",
                  color: "#71717a",
                  fontWeight: "600",
                }}
              >
                AUTO-REFRESH: 3s
              </span>
            </div>

            {leaderboard.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "64px 0",
                  color: "#71717a",
                }}
              >
                <UserX
                  style={{
                    width: "48px",
                    height: "48px",
                    margin: "0 auto 16px auto",
                    color: "#27272a",
                  }}
                />
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#a1a1aa",
                    margin: 0,
                  }}
                >
                  No players registered on the leaderboard
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    marginTop: "6px",
                    color: "#71717a",
                  }}
                >
                  Use the left panel to submit player scores.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {leaderboard.map((item, idx) => {
                  const isTop1 = idx === 0;
                  const isTop2 = idx === 1;
                  const isTop3 = idx === 2;

                  let cardBg = "#18181b";
                  let borderStyle = "1px solid #27272a";
                  let badgeBg = "#27272a";
                  let badgeColor = "#a1a1aa";

                  if (isTop1) {
                    cardBg = "linear-gradient(90deg, #2b000a 0%, #121215 100%)";
                    borderStyle = "1px solid #ff003c88";
                    badgeBg = "#ff003c";
                    badgeColor = "#ffffff";
                  } else if (isTop2) {
                    cardBg = "#18181b";
                    borderStyle = "1px solid #52525b";
                    badgeBg = "#71717a";
                    badgeColor = "#ffffff";
                  } else if (isTop3) {
                    cardBg = "#18181b";
                    borderStyle = "1px solid #3f3f46";
                    badgeBg = "#3f3f46";
                    badgeColor = "#d4d4d8";
                  }

                  return (
                    <div
                      key={item.username}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "16px 20px",
                        borderRadius: "14px",
                        background: cardBg,
                        border: borderStyle,
                        transition: "transform 0.2s",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                        }}
                      >
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "9999px",
                            backgroundColor: badgeBg,
                            color: badgeColor,
                            display: "flex",
                            alignItems: "center",
                            justifyCenter: "center",
                            fontWeight: "900",
                            fontSize: "14px",
                            border: "1px solid #ff003c44",
                          }}
                        >
                          {isTop1 ? (
                            <Crown
                              style={{
                                width: "20px",
                                height: "20px",
                                margin: "auto",
                              }}
                            />
                          ) : (
                            `#${idx + 1}`
                          )}
                        </div>
                        <div>
                          <span
                            style={{
                              fontWeight: "800",
                              fontSize: "16px",
                              color: "#ffffff",
                            }}
                          >
                            {item.username}
                          </span>
                          {isTop1 && (
                            <span
                              style={{
                                marginLeft: "10px",
                                fontSize: "10px",
                                backgroundColor: "#ff003c22",
                                color: "#ff4d6d",
                                border: "1px solid #ff003c55",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                fontWeight: "800",
                              }}
                            >
                              RANK #1
                            </span>
                          )}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <Zap
                          style={{
                            width: "16px",
                            height: "16px",
                            color: "#ff003c",
                          }}
                        />
                        <span
                          style={{
                            fontWeight: "900",
                            fontSize: "20px",
                            fontFamily: "monospace",
                            color: "#ffffff",
                          }}
                        >
                          {item.score}
                        </span>
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#71717a",
                            fontWeight: "600",
                          }}
                        >
                          PTS
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
