require("dotenv").config();

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_PATH,
  DEPLOY_REF = "origin/main",
} = process.env;

module.exports = {
  apps: [
    {
      name: "mesto-backend",
      script: "./dist/app.js",
    },
  ],

  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: "git@github.com:AlexeyNewDeveloper/mesto-project-plus.git",
      path: DEPLOY_PATH,
      "pre-deploy-local": `scp ./.env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}`,
      "post-deploy":
        "cd ~/mesto-project-plus/ && npm i && npm run build && pm2 startOrRestart ecosystem.config.js --env production",
    },
  },
};
