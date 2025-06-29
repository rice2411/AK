// Environment variables configuration
export const config = {
  // Taiga Configuration
  taiga: {
    baseUrl: import.meta.env.VITE_TAIGA_BASE_URL,
    email: import.meta.env.VITE_TAIGA_EMAIL,
    password: import.meta.env.VITE_TAIGA_PASSWORD,
  },

  // Team Members
  team: {
    members: [
      {
        id: parseInt(import.meta.env.VITE_TEAM_MEMBER_1_ID || "185"),
        name: import.meta.env.VITE_TEAM_MEMBER_1_NAME || "PhucLH",
      },
      {
        id: parseInt(import.meta.env.VITE_TEAM_MEMBER_2_ID || "193"),
        name: import.meta.env.VITE_TEAM_MEMBER_2_NAME || "AnVV",
      },
    ],
  },
};

// Validate required environment variables
export const validateConfig = () => {
  const requiredVars = [
    "VITE_TAIGA_BASE_URL",
    "VITE_TAIGA_EMAIL",
    "VITE_TAIGA_PASSWORD",
  ];

  const missingVars = requiredVars.filter(
    (varName) => !import.meta.env[varName]
  );

  if (missingVars.length > 0) {
    console.warn("Missing environment variables:", missingVars);
    console.warn(
      "Using default values. Please create a .env file with the required variables."
    );
  }
};
