import Fastify from 'fastify';

import { users } from './users';

const fastify = Fastify({
  logger: true,
});
fastify.register(import('@fastify/cors'));
fastify.register(import('@fastify/multipart'), {
  addToBody: true,
});
fastify.register(import('@fastify/cookie'));

fastify.post('/uppercase', (request, reply) => {
  if (!request.body.toLowerCase().includes('fuck')) {
    reply.send(request.body.toUpperCase());
  } else {
    reply.status(403).send('unresolved');
  }
})

fastify.post('/lowercase', (request, reply) => {
  if (!request.body.toLowerCase().includes('fuck')) {
    reply.send(request.body.toLowerCase());
  } else {
    reply.status(403).send('unresolved');
  }
})

fastify.get('/user/:id', (request, reply) => {
  const { id } = request.params;
  if (users[id]) {
    return reply.send(users[id]);
  }
  reply.status(403).send({ info: "User does not exist" });
})

fastify.get('/users', (request, reply) => {
  const {filter, value} = request.query;

  const result = Object.values(users)
  if (!filter && !value) {
    reply.send(result);
  }
  reply.send(result.filter((user) => String(user[filter]) === value));
})

export default fastify;
