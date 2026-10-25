import { z } from 'zod';

export default schema => (req, res, next) => (req.valid = schema.parse(req), next())
