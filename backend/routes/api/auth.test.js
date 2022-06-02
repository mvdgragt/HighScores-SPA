const request = require('supertest');
const app = require('../../app.js');

describe('/api/auth', () => {


    describe('when sending valid credentials', () => {
        
        const credentials = {
            user_name: "Admin", 
            user_password: "admin123"
        };

        test('should return status code 200 OK', async () => {

            const response = await request(app)
                .post('/api/auth')
                .send(credentials);
            
            expect(response.statusCode)
                .toBe(200); // 200 OK
        });
        
        test('should set content type to application/json', async () => {

            const response = await request(app)
                .post('/api/auth')
                .send(credentials);

            expect(response.headers['content-type'])
                .toEqual(expect.stringContaining('application/json'));
        });

        test('should return token', async () => {

            const response = await request(app)
                .post('/api/auth')
                .send(credentials);

            expect(response.body)
                .toHaveProperty('token');  
        });
    });

    describe('when sending invalid credentials', () => {

        const credentials = {
            user_name: "admin@gmail.com", 
            user_password: "invalidpassword"
        };

        test('should return status code 401 Unauthorized', async () => {

            const response = await request(app)
                .post('/api/auth')
                .send(credentials);

            expect(response.statusCode)
                .toBe(401); // 401 Unauthorized
        });
    });

});