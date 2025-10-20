const request = require('supertest');
const express = require('express');
const app = require('../payment/server');

describe('Payment API Tests', () => {
  it('should create payment request', async () => {
    const response = await request(app)
      .post('/payment/request')
      .send({
        amount: 15000,
        description: 'تست سفر'
      })
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.paymentId).toBeDefined();
  });

  it('should require amount and description', async () => {
    const response = await request(app)
      .post('/payment/request')
      .send({})
      .expect(200);
    
    expect(response.body.success).toBe(false);
  });
});
