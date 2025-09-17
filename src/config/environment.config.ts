export const environmentConfig = () => ({
  server: {
    port: Number(process.env.PORT),
    baseUrl: process.env.BASE_APP_URL,
  },

  frontend: {
    url: process.env.FRONTEND_URL,
  },
});
