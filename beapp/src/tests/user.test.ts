import request  from "supertest";
import { prisma } from "../utils/prismaClient";
import express from "express";
import { app } from "../index";


// describe('POST /sign-in', () => {
//   // Clean up the database after each test
//   afterEach(async () => {
//     await prisma.user.deleteMany();
//   });

//   // Test successful user registrationF
//   it('should register a new user and return 201 status', async () => {
//     const response = await request(app)
//       .post('/auth/sign-in')
//       .send({
//         email: 'test@example.com',
//         password: 'password123',
//       });

//     expect(response.statusCode).toBe(201);
//     expect(response.body.success).toBe(true);
//     expect(response.body.message).toBe('User registered successfully!');
//   });


//   it('should return 400 status if email or password is missing', async () => {
//     const response = await request(app)
//       .post('/auth/sign-in')
//       .send({
//         email: '', 
//         password: 'password123',
//       });

//     expect(response.statusCode).toBe(400);
//     expect(response.body.success).toBe(false);
//     expect(response.body.message).toBe('All fields are required');
//   });


//   it('should return 400 status if email already exists', async () => {

//     await prisma.user.create({
//       data: {
//         email: 'test@example.com',
//         password: 'hashedPassword',
//       },
//     });

//     const response = await request(app)
//       .post('/auth/sign-in')
//       .send({
//         email: 'test@example.com',
//         password: 'password123',
//       });

//     expect(response.statusCode).toBe(400);
//     expect(response.body.success).toBe(false);
//     expect(response.body.message).toBe('Email already exists!');
//   });


//   it('should return 500 status if an internal server error occurs', async () => {
//     jest.spyOn(prisma.user, 'findUnique').mockImplementation(() => {
//       throw new Error('Database error');
//     });
  
//     const response = await request(app)
//       .post('/auth/sign-in')
//       .send({
//         email: 'test@example.com',
//         password: 'password123',
//       });
  
//     expect(response.statusCode).toBe(500);
//     expect(response.body.success).toBe(false);
//     expect(response.body.message).toBe('Internal server error');
//   });
// });


describe('POST /login', () => {
  it('should login a user and return 200 status', async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'test@email.com',
      password: 'password',
    })
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
  })
  it('it should return 400 status', async () => {
    const response = await request(app).post('/auth/login').send({
      email: '',
      password: 'password123',
    })
    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('All fields are required');
  })
  it('it should return 400 status if user does not exist', async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    })
    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("User not found");
  })

  it('it should return 400 status if user does not exist', async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'test@email.com',
      password: 'password123',
    })
    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Invalid credentials");
  })

})