export const config = {
    server: {
        port: process.env.PORT || 3001, 
    },
        jwtSecret: process.env.JWT_SECRET || 'defaultSecret'   
};
export type Config = typeof config;