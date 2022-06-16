import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import mercurius from 'mercurius';

const server: FastifyInstance = Fastify({});

const opts: RouteShorthandOptions = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    pong: {
                        type: 'string',
                    },
                },
            },
        },
    },
};

server.get('/ping', opts, async (request, reply) => {
    return { pong: 'it worked!' };
});

const start = async () => {
    try {
        await server.listen({ port: 3000 });

        const address = server.server.address();
        const port = typeof address === 'string' ? address : address?.port;
        console.log(`listening on http://localhost:${port}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};
start();
