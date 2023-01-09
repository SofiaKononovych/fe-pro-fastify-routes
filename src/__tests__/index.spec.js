import fastify from '../index.mjs';

import { users } from '../users';

describe('fastify', () => {
  describe('/uppercase route', () => {
    it('should returns correct string', async () => {
      const result = await fastify.inject({
        method: 'POST',
        url: '/uppercase',
        payload: 'my string',
        headers: {
          'content-type': 'text/plain; charset=utf-8',
        },
      });
      expect(result.body).toStrictEqual('MY STRING');
    });

    describe('when sent restricted word', () => {
      it('should return correct string', async () => {
        const result = await fastify.inject({
          method: 'POST',
          url: '/uppercase',
          payload: 'my fucking word',
          headers: {
            'content-type': 'text/plain; charset=utf-8',
          },
        });
        expect(result.body).toStrictEqual('unresolved');
        expect(result.statusCode).toStrictEqual(403);
      });

      describe('with different casing word', () => {
        it('should return correct string', async () => {
          const result = await fastify.inject({
            method: 'POST',
            url: '/uppercase',
            payload: 'my FuCkIng word',
            headers: {
              'content-type': 'text/plain; charset=utf-8',
            },
          });
          expect(result.body).toStrictEqual('unresolved');
          expect(result.statusCode).toStrictEqual(403);
        });
      });
    });
  });

  describe('/lowercase route', () => {
    it('should returns correct string', async () => {
      const result = await fastify.inject({
        method: 'POST',
        url: '/lowercase',
        payload: 'MY STRING',
        headers: {
          'content-type': 'text/plain; charset=utf-8',
        },
      });
      expect(result.body).toStrictEqual('my string');
    });

    describe('when sent restricted word', () => {
      it('should return correct string', async () => {
        const result = await fastify.inject({
          method: 'POST',
          url: '/lowercase',
          payload: 'my fucking word',
          headers: {
            'content-type': 'text/plain; charset=utf-8',
          },
        });
        expect(result.body).toStrictEqual('unresolved');
        expect(result.statusCode).toStrictEqual(403);
      });

      describe('with different casing word', () => {
        it('should return correct string', async () => {
          const result = await fastify.inject({
            method: 'POST',
            url: '/lowercase',
            payload: 'my FuCkIng word',
            headers: {
              'content-type': 'text/plain; charset=utf-8',
            },
          });
          expect(result.body).toStrictEqual('unresolved');
          expect(result.statusCode).toStrictEqual(403);
        });
      });
    });
  });

  describe('/user dynamic route', () => {
    it.each(Object.entries(users))(
      'should return %i object',
      async (key, value) => {
        const result = await fastify.inject({
          method: 'GET',
          url: `/user/${key}`,
        });
        expect(result.body).toStrictEqual(JSON.stringify(value));
      }
    );

    describe('with not existing id', () => {
      it('should return correct status and info', async () => {
        const result = await fastify.inject({
          method: 'GET',
          url: `/user/100`,
        });

        expect(result.statusCode).toStrictEqual(400);
        expect(result.body).toStrictEqual('User not exist');
      });
    });
  });

  describe('/users route', () => {
    it('returns correct objects', async () => {
      expect(
        (
          await fastify.inject({
            method: 'GET',
            url: '/users',
            query: {
              filter: 'age',
              value: '23',
            },
          })
        ).body
      ).toStrictEqual(JSON.stringify([users[3]]));

      expect(
        (
          await fastify.inject({
            method: 'GET',
            url: '/users',
            query: {
              filter: 'position',
              value: 'designer',
            },
          })
        ).body
      ).toStrictEqual(JSON.stringify([users[9], users[10]]));

      expect(
        (
          await fastify.inject({
            method: 'GET',
            url: '/users',
            query: {
              filter: 'firstName',
              value: 'Mariia',
            },
          })
        ).body
      ).toStrictEqual(JSON.stringify([users[10]]));

      expect(
        (
          await fastify.inject({
            method: 'GET',
            url: '/users',
          })
        ).body
      ).toStrictEqual(
        JSON.stringify([...Object.entries(users).map(([, value]) => value)])
      );
    });
  });
});
