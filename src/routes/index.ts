import { Hono } from 'hono';
import authRoutes from './auth';
import protectedRoutes from './protected';


const routesHandler = new Hono();

routesHandler.get('/health', (c) => c.json({ status: 'ok' }));
routesHandler.route('/a', protectedRoutes);
routesHandler.route('/auth', authRoutes);

export default routesHandler;