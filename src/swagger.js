import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User API",
      version: "1.0.0",
      description: "Документация API сервера gameshop",
    },
    components: {
        schemas: {
            game: {
                type: "object",
                properties: {
                    game_id: { type: "integer", example: 1 },
                    name: { type: "string", example: "Cyberpunk 2077" },
                    price: { type: "number", example: 59.99 },
                    genres: { type: "array", items: { type: "string" } },
                    game_img: { type: "string", format: "binary" },
                    description: { type: "string", example: "Futuristic open-world RPG" },
                    rating: { type: "number", example: 8.5 },
                    developer: { type: "string", example: "CD Projekt Red" },
                },
            },
            gameReq: {
              type: "object",
              properties: {
                  name: { type: "string", example: "Cyberpunk 2077" },
                  price: { type: "number", example: 59.99 },
                  genres: { type: "array", items: { type: "string" } },
                  game_img: { type: "string", format: "binary", example:"/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAMCAggICAgICAgICAgICAgICAgICA...AAAAAAAAAAAA//9k=" },
                  description: { type: "string", example: "Futuristic open-world RPG" },
                  rating: { type: "number", example: 8.5 },
                  developer: { type: "string", example: "CD Projekt Red" },
              },
          },
            AuthRes: {
                type: "object",
                properties: {
                    user_info_id: {type: "integer", example: 1},
                    username: {type: "string",example: "username"},
                    email: {type: "string", example:"email@email.com"},
                    image_data: {type:"string",format:"binary", example:"/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAMCAggICAgICAgICAgICAgICAgICA...AAAAAAAAAAAA//9k="},
                    bio:{type:"string",example:"example bio"},
                },
            },
            AuthReq: {
              type:"object",
              properties:{
                  login:{type:"string",example:"login"},
                  password:{type:"string",example:"password"},
              },
           },
           UserCredentialRes: {
            type:"object",
            properties:{
                user_credential_id:{type:"string",example:"1"},
                user_info_id:{type:"string",example:"1"},
                login:{type:"string",example:"login"},
                password:{type:"string",example:"password"},
            },
         },
           SignUpReq: {
            type:"object",
            properties:{
                login:{type:"string",example:"login"},
                password:{type:"string",example:"password"},
                username:{type:"string",example:"username"}
            },
          },
          SignUpRes: {
            type:"object",
            properties:{
              message: { type: "string", example: "Пользователь успешно зарегистрирован" },
              userInfoId: { type: "integer", example: 1 },
            },
          },
          UserInfoRes: {
            type: "object",
            properties: {
                user_info_id: {type: "integer", example: 1},
                username: {type: "string",example: "username"},
                email: {type: "string", example:"email@email.com"},
                image_data: {type:"string",format:"binary", example:"/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAMCAggICAgICAgICAgICAgICAgICA...AAAAAAAAAAAA//9k="},
                bio:{type:"string",example:"example bio"},
            },
        },
        },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Локальный сервер",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Указываем, где лежат файлы с описанием API
};

export const swaggerDocs = swaggerJsdoc(swaggerOptions);
export { swaggerUi };
